const express = require("express");
const crypto = require("crypto");
const getRawBody = require("raw-body");

const router = express.Router();

const logger = require("../../global/logger");
const {
  APP_HOME_OPENED,
  APP_UNINSTALLED,
  TOKENS_REVOKED,
  APP_MENTION,
  MESSAGE,
  IM_CHANNEL_TYPE
} = require("../../global/constants");
const {
  INTERNAL_SLACK_TEAM_ID,
  INTERNAL_SLACK_CHANNEL_ID
} = require("../../global/config");
const User = require("../../mongo/models/User");
const { deleteSlackAuthByTeamId } = require("../../mongo/helper/auth");
const { deleteSlackUsersByTeamId } = require("../../mongo/helper/user");
const { postInternalMessage, getSlackUser } = require("../../slack/api");
const { handleDirectMessage } = require("../../slack/events/direct-message");
const { publishStats } = require("../../slack/app-home");
const {
  createAPITokensRevokedTemplate,
  createAppUninstalledTemplate
} = require("../../slack/templates");

// HELPER

const verify = (slackRequestTimestamp, slackSignature, body) => {
  // logger.debug("slackSignature : ", slackSignature);

  const currentTime = Math.floor(new Date().getTime() / 1000);
  if (Math.abs(currentTime - slackRequestTimestamp) > 5 * 60) {
    return {
      error: true,
      status: 403,
      message: "You can't replay me!"
    };
  }

  const baseString = `v0:${slackRequestTimestamp}:${JSON.stringify(body)}`;
  // logger.debug("baseString : ", baseString);

  const hmac = crypto.createHmac("sha256", process.env.SLACK_SIGNING_SECRET);

  hmac.update(baseString);

  const digest = hmac.digest("hex");

  const appSignature = `v0=${digest}`;
  // logger.debug("appSignature : ", appSignature);

  if (slackSignature !== appSignature) {
    return {
      error: true,
      status: 403,
      message: "Nice try buddy!"
    };
  }

  return {
    error: false
  };
};

router.get("/health", (req, res) =>
  res.json({ msg: "SLACK EVENTS API IS UP AND RUNNING!!!" })
);

router.post("/", async (req, res) => {
  try {
    let payload = req.body;

    logger.debug("payload : ", JSON.stringify(payload));

    let parseRawBody = null;
    if (req.rawBody) {
      parseRawBody = Promise.resolve(req.rawBody);
    } else {
      parseRawBody = getRawBody(req);
    }

    // await new Errors({
    //   payload,
    //   error: { headers: req.headers },
    //   type: "SLACK_EVENTS"
    // }).save();

    parseRawBody.then((bodyBuf) => {
      const rawBody = bodyBuf.toString();

      const slackRequestTimestamp = req.headers["x-slack-request-timestamp"];
      const slackSignature = req.headers["x-slack-signature"];

      const isLegitRequest = verify(
        slackRequestTimestamp,
        slackSignature,
        rawBody
      );
      logger.debug("isLegitRequest : ", isLegitRequest);

      if (isLegitRequest.error) {
        const { status, message } = isLegitRequest;
        return res.status(status).send(message);
      }

      payload = JSON.parse(rawBody);
    });

    // CHALLENGE
    if (req.body.challenge) {
      return res.status(200).json({ challenge: req.body.challenge });
    }

    // APP_MENTION
    if (payload.event && payload.event.type === APP_MENTION) {
      res.sendStatus(200);
      logger.debug(APP_MENTION);

      // const { text, channel, team } = payload.event;
    }

    // APP_HOME_OPENED
    if (payload.event && payload.event.type === APP_HOME_OPENED) {
      res.sendStatus(200);

      const { user: slackUserId } = payload.event;

      const user = await User.findOne({
        "slackUserData.id": slackUserId,
        slackDeleted: false
      });

      if (user && !user.appHomePublished) {
        const slackUsername = user.slackUserData.name;
        await publishStats(payload.team_id, slackUserId, slackUsername);
      }

      if (!user) {
        const slackUserData = await getSlackUser(payload.team_id, slackUserId);
        await publishStats(payload.team_id, slackUserId);
        await new User({ slackUserData, appHomePublished: true }).save();
      }
    }

    // DIRECT MESSAGE
    if (
      payload.event &&
      payload.event.type === MESSAGE &&
      payload.event.channel_type === IM_CHANNEL_TYPE
    ) {
      res.sendStatus(200);

      if (
        !payload.event.bot_id &&
        !String(payload.event.text).includes("/cheers")
      ) {
        logger.info("DIRECT MESSAGE");
        await handleDirectMessage(payload);
      }
    }

    // TOKENS_REVOKED
    if (payload.event && payload.event.type === TOKENS_REVOKED) {
      res.sendStatus(200);
      logger.info("TOKENS_REVOKED");

      const apiTokensRevokedTemplate = createAPITokensRevokedTemplate(
        payload.team_id
      );

      await postInternalMessage(
        INTERNAL_SLACK_TEAM_ID,
        INTERNAL_SLACK_CHANNEL_ID,
        apiTokensRevokedTemplate
      );
    }

    // APP_UNINSTALLED
    if (payload.event && payload.event.type === APP_UNINSTALLED) {
      res.sendStatus(200);
      logger.info("SLACK_APP_UNINSTALLED");

      const slackAppUninstalledTemplate = createAppUninstalledTemplate(
        payload.team_id
      );

      await postInternalMessage(
        INTERNAL_SLACK_TEAM_ID,
        INTERNAL_SLACK_CHANNEL_ID,
        slackAppUninstalledTemplate
      );

      // update user and auth, set slack deleted to true for this team

      await deleteSlackUsersByTeamId(payload.team_id);
      await deleteSlackAuthByTeamId(payload.team_id);
    }
  } catch (error) {
    logger.error("/slack-events -> error : ", error);
  }
});

module.exports = router;