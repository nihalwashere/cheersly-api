const express = require("express");

const router = express.Router();

const {
  INTERNAL_SLACK_TEAM_ID,
  INTERNAL_SLACK_CHANNEL_ID,
} = require("../../global/config");
const { createAppInstalledTemplate } = require("../../slack/templates");
const {
  getSlackTokenForUser,
  postInternalMessage,
} = require("../../slack/api");
const { paginateUsersList } = require("../../slack/pagination/users-list");
const {
  upsertAuth,
  getAuthDeletedOrNotDeleted,
} = require("../../mongo/helper/auth");
const { getUserDataBySlackUserId } = require("../../mongo/helper/user");
const {
  addDefaultCompanyValuesForTeam,
} = require("../../mongo/helper/companyValues");
const { addDefaultRewardsForTeam } = require("../../mongo/helper/rewards");
const { sendOnBoardingInstructions } = require("../../slack/onboarding");
const { createTrialSubscription } = require("../../utils/common");
const logger = require("../../global/logger");

router.post("/slack-install", async (req, res) => {
  try {
    logger.debug("/slack-install -> req.body : ", req.body);

    const { code } = req.body;

    if (code) {
      const slackTokenPayload = await getSlackTokenForUser(code);
      logger.info("slackTokenPayload : ", slackTokenPayload);

      if (slackTokenPayload && slackTokenPayload.ok === true) {
        const {
          team: { id: teamId, name: teamName },
          access_token,
          authed_user: { id: authedUserId },
        } = slackTokenPayload;

        // check if installation already exists
        const auth = await getAuthDeletedOrNotDeleted(teamId);

        if (!auth) {
          // if installation does not exist already, then create trial subscription
          await createTrialSubscription(teamId);
          await addDefaultCompanyValuesForTeam(teamId);
          await addDefaultRewardsForTeam(teamId);
        }

        await upsertAuth(teamId, {
          slackInstallation: slackTokenPayload,
          slackDeleted: false,
        });

        await paginateUsersList(access_token);

        if (!auth) {
          await sendOnBoardingInstructions(teamId, authedUserId);
        }

        const authedUser = await getUserDataBySlackUserId(authedUserId);

        await postInternalMessage(
          INTERNAL_SLACK_TEAM_ID,
          INTERNAL_SLACK_CHANNEL_ID,
          createAppInstalledTemplate({
            teamId,
            teamName,
            authedUser: authedUser.slackUserData,
          })
        );
      }
    }

    return res.sendStatus(200);
  } catch (error) {
    logger.error("/slack-install -> error : ", error);
  }
});

module.exports = router;
