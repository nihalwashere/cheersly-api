const express = require("express");
const logger = require("../../global/logger");
const { actionsHandler } = require("../../slack/actions/handler");
const {
  viewSubmissionHandler,
} = require("../../slack/view-submissions/handler");
const { shortcutsHandler } = require("../../slack/shortcuts/handler");
const { verifySlackRequest } = require("../../utils/common");
const {
  SLACK_ACTIONS: { BLOCK_ACTIONS, VIEW_SUBMISSION, SHORTCUT },
} = require("../../global/constants");

const router = express.Router();

// SLACK ACTIONS

router.post("/", async (req, res) => {
  try {
    const slackRequestTimestamp = req.headers["x-slack-request-timestamp"];
    const slackSignature = req.headers["x-slack-signature"];

    const isLegitRequest = verifySlackRequest(
      slackRequestTimestamp,
      slackSignature,
      req.rawBody
    );

    const { payload } = req.body;

    const parsedPayload = JSON.parse(payload);

    if (isLegitRequest.error) {
      const { status, message } = isLegitRequest;
      return res.status(status).send(message);
    }

    logger.debug("parsedPayload : ", JSON.stringify(parsedPayload));

    const { type } = parsedPayload;

    if (type === BLOCK_ACTIONS) {
      res.sendStatus(200);

      return await actionsHandler(parsedPayload);
    }

    if (type === VIEW_SUBMISSION) {
      const response = await viewSubmissionHandler(parsedPayload);

      logger.debug("response : ", response);

      if (response.success) {
        return res.status(200).send({});
      }
    }

    if (type === SHORTCUT) {
      res.sendStatus(200);

      return await shortcutsHandler(parsedPayload);
    }
  } catch (error) {
    logger.error("/slack-actions -> error : ", error);
  }
});

module.exports = router;
