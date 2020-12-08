const express = require("express");

const router = express.Router();

const logger = require("../../global/logger");
const { verifySlackRequest } = require("../../utils/common");
const { isHelpCommand, handleHelp } = require("../../slack/commands/help");

router.get("/health", (req, res) =>
  res.json({ msg: "SLACK COMMANDS API IS UP AND RUNNING!!!" })
);

router.post("/", async (req, res) => {
  try {
    logger.debug("req.body : ", req.body);
    logger.debug("req.headers : ", req.headers);

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

    const { team_id, channel_id, text, trigger_id } = req.body;

    // res.sendStatus(200);

    if (isHelpCommand(text)) {
      // /codekick help

      res.status(200).json({
        response_type: "in_channel",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Seeking some help...",
            },
          },
        ],
      });

      return await handleHelp(team_id, channel_id);
    }
  } catch (error) {
    logger.error("/slack-commands -> error : ", error);
  }
});

module.exports = router;
