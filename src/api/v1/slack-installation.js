const express = require("express");

const router = express.Router();

const logger = require("../../global/logger");
const { getSlackTokenForUser } = require("../../slack/api");
const { paginateUsersList } = require("../../slack/pagination/users-list");
const { addAuth } = require("../../mongo/helper/auth");
const { sendOnBoardingInstructions } = require("../../slack/onboarding");

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
        await sendOnBoardingInstructions(teamId);
        await paginateUsersList(access_token);
      }
    }

    return res.sendStatus(200);
  } catch (error) {
    logger.error("/slack-install -> error : ", error);
  }
});

module.exports = router;
