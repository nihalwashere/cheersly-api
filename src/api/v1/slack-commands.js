const express = require("express");

const router = express.Router();

const logger = require("../../global/logger");
const { verifySlackRequest } = require("../../utils/common");
const { isHelpCommand } = require("../../slack/commands/help");
const { createHelpTemplate } = require("../../slack/commands/help/template");
const {
  isCheersCommand,
  handleCheersCommand
} = require("../../slack/commands/cheers");

router.get("/health", (req, res) =>
  res.json({ msg: "SLACK COMMANDS API IS UP AND RUNNING!!!" })
);

router.post("/", async (req, res) => {
  try {
    logger.debug("req.body : ", req.body);

    const slackRequestTimestamp = req.headers["x-slack-request-timestamp"];
    const slackSignature = req.headers["x-slack-signature"];

    const isLegitRequest = verifySlackRequest(
      slackRequestTimestamp,
      slackSignature,
      req.body
    );

    if (isLegitRequest.error) {
      const { status, message } = isLegitRequest;
      return res.status(status).send(message);
    }

    const { team_id, channel_id, user_name, text } = req.body;

    if (isCheersCommand(text)) {
      // /cheers @user1 @user2 @user3 Thanks for all the help

      res.send("");

      return await handleCheersCommand(team_id, channel_id, user_name, text);
    }

    // /cheers help
    return res.status(200).json({
      response_type: "in_channel",
      blocks: createHelpTemplate()
    });
  } catch (error) {
    logger.error("/slack-commands -> error : ", error);
  }
});

module.exports = router;
