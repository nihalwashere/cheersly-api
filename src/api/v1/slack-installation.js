const express = require("express");

const router = express.Router();

const logger = require("../../global/logger");
const {
  INTERNAL_SLACK_TEAM_ID,
  INTERNAL_SLACK_CHANNEL_ID
} = require("../../global/config");
const { createAppInstalledTemplate } = require("../../slack/templates");
const {
  getSlackTokenForUser,
  postInternalMessage
} = require("../../slack/api");
const { paginateUsersList } = require("../../slack/pagination/users-list");
const {
  getAuthDataForSlackTeam,
  addAuth,
  updateAuth
} = require("../../mongo/helper/auth");
const { sendOnBoardingInstructions } = require("../../slack/onboarding");
const { createTrialSubscription } = require("../../utils/common");

router.post("/slack-install", async (req, res) => {
  try {
    logger.debug("/slack-install -> req.body : ", req.body);

    const { code } = req.body;

    if (code) {
      const slackTokenPayload = await getSlackTokenForUser(code);
      logger.info("slackTokenPayload : ", slackTokenPayload);

      if (slackTokenPayload && slackTokenPayload.ok === true) {
        const {
          team: { id: teamId },
          access_token
        } = slackTokenPayload;

        // check if installation already exists
        const auth = await getAuthDataForSlackTeam(teamId);

        if (!auth) {
          // create new auth
          await addAuth({ slackInstallation: slackTokenPayload });
          await paginateUsersList(access_token);
        } else {
          // update auth
          await updateAuth(teamId, slackTokenPayload);
        }

        await sendOnBoardingInstructions(teamId);
        await createTrialSubscription(teamId);
        await postInternalMessage(
          INTERNAL_SLACK_TEAM_ID,
          INTERNAL_SLACK_CHANNEL_ID,
          createAppInstalledTemplate(teamId)
        );
      }
    }

    return res.sendStatus(200);
  } catch (error) {
    logger.error("/slack-install -> error : ", error);
  }
});

module.exports = router;
