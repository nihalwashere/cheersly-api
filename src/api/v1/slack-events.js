const express = require("express");

const router = express.Router();

const {
  APP_HOME_OPENED,
  APP_UNINSTALLED,
  TOKENS_REVOKED,
  APP_MENTION,
  MESSAGE,
  IM_CHANNEL_TYPE,
} = require("../../global/constants");
const {
  INTERNAL_SLACK_TEAM_ID,
  INTERNAL_SLACK_CHANNEL_ID,
} = require("../../global/config");
const {
  getAuthDataForSlackTeam,
  deleteSlackAuthByTeamId,
} = require("../../mongo/helper/auth");
const {
  getUserDataBySlackUserId,
  deleteSlackUsersByTeamId,
  updateAppHomePublishedForUser,
} = require("../../mongo/helper/user");
const { getSlackUser, postInternalMessage } = require("../../slack/api");
const { handleDirectMessage } = require("../../slack/events/direct-message");
const { publishStats } = require("../../slack/app-home");
const {
  isSubscriptionValidForSlack,
  verifySlackRequest,
} = require("../../utils/common");
const {
  createAPITokensRevokedTemplate,
  createAppUninstalledTemplate,
} = require("../../slack/templates");
const {
  SubscriptionMessageType,
} = require("../../enums/subscriptionMessageTypes");
const logger = require("../../global/logger");

router.post("/", async (req, res) => {
  try {
    logger.debug("req.body : ", JSON.stringify(req.body));

    const slackRequestTimestamp = req.headers["x-slack-request-timestamp"];
    const slackSignature = req.headers["x-slack-signature"];

    const isLegitRequest = verifySlackRequest(
      slackRequestTimestamp,
      slackSignature,
      req.rawBody
    );

    if (isLegitRequest.error) {
      const { status, message } = isLegitRequest;
      return res.status(status).send(message);
    }

    const { team_id: teamId, user_id: userId, event } = req.body;

    // CHALLENGE
    if (req.body.challenge) {
      return res.status(200).json({ challenge: req.body.challenge });
    }

    // APP_MENTION
    if (event && event.type === APP_MENTION) {
      res.sendStatus(200);
      logger.debug(APP_MENTION);
    }

    // APP_HOME_OPENED
    if (event && event.type === APP_HOME_OPENED) {
      res.sendStatus(200);

      const { user: slackUserId } = event;

      const user = await getUserDataBySlackUserId(slackUserId);

      if (!user) {
        await publishStats({ teamId, slackUserId });

        return await updateAppHomePublishedForUser(slackUserId, true);
      }

      if (user && !user.appHomePublished) {
        const subscriptionInfo = await isSubscriptionValidForSlack(teamId);

        let isSubscriptionExpired = false;
        let isTrialPlan = true;

        if (!subscriptionInfo.hasSubscription) {
          isSubscriptionExpired = true;

          if (subscriptionInfo.messageType !== SubscriptionMessageType.TRIAL) {
            isTrialPlan = false;
          }
        }

        await publishStats({
          teamId,
          slackUserId,
          slackUsername: user.slackUserData.name,
          isSubscriptionExpired,
          isTrialPlan,
        });

        return await updateAppHomePublishedForUser(slackUserId, true);
      }
    }

    // DIRECT MESSAGE
    if (
      event &&
      event.type === MESSAGE &&
      event.channel_type === IM_CHANNEL_TYPE
    ) {
      res.sendStatus(200);

      if (!event.bot_id && !String(event.text).includes("/cheers")) {
        logger.info("DIRECT MESSAGE");
        await handleDirectMessage(req.body);
      }
    }

    // TOKENS_REVOKED
    if (event && event.type === TOKENS_REVOKED) {
      res.sendStatus(200);
      logger.info("TOKENS_REVOKED");

      const apiTokensRevokedTemplate = createAPITokensRevokedTemplate(teamId);

      await postInternalMessage(
        INTERNAL_SLACK_TEAM_ID,
        INTERNAL_SLACK_CHANNEL_ID,
        apiTokensRevokedTemplate
      );
    }

    // APP_UNINSTALLED
    if (event && event.type === APP_UNINSTALLED) {
      res.sendStatus(200);
      logger.info("SLACK_APP_UNINSTALLED");

      const auth = await getAuthDataForSlackTeam(teamId);

      const {
        slackInstallation: {
          authed_user: { id: authedUserId },
          team: { name: teamName },
        },
      } = auth;

      const authedUser = await getSlackUser(teamId, authedUserId);

      const userWhoDeleted = await getSlackUser(teamId, userId);

      const slackAppUninstalledTemplate = createAppUninstalledTemplate({
        teamId,
        teamName,
        authedUser,
        userWhoDeleted,
      });

      await postInternalMessage(
        INTERNAL_SLACK_TEAM_ID,
        INTERNAL_SLACK_CHANNEL_ID,
        slackAppUninstalledTemplate
      );

      // update user and auth, set slack deleted to true for this team

      await deleteSlackUsersByTeamId(teamId);
      await deleteSlackAuthByTeamId(teamId);
    }
  } catch (error) {
    logger.error("/slack-events -> error : ", error);
  }
});

module.exports = router;
