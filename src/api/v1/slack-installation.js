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
const { addAuth } = require("../../mongo/helper/auth");
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

        await addAuth({ slackInstallation: slackTokenPayload });
        await createTrialSubscription(teamId);
        await sendOnBoardingInstructions(teamId);
        await paginateUsersList(access_token);
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
