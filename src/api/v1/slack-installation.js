const express = require("express");

const router = express.Router();

const logger = require("../../global/logger");
const { getSlackTokenForUser } = require("../../slack/api");
const { addAuth } = require("../../mongo/helper/auth");
const { sendOnBoardingInstructions } = require("../../slack/onboarding");

router.post("/slack-install", async (req, res) => {
  try {
    logger.debug("req.body : ", req.body);

    const { code } = req.body;

    if (code) {
      const slackTokenPayload = await getSlackTokenForUser(code);
      logger.debug("slackTokenPayload : ", slackTokenPayload);

      if (slackTokenPayload && slackTokenPayload.ok === true) {
        await addAuth({ slackInstallation: slackTokenPayload });
        await sendOnBoardingInstructions(slackTokenPayload.team.id);
      }
    }

    return res.sendStatus(200);
  } catch (error) {
    logger.error("/slack-install -> error : ", error);
  }
});

module.exports = router;
