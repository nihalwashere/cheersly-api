const express = require("express");
const logger = require("../../global/logger");
const {
  viewSubmissionHandler
} = require("../../slack/view-submissions/handler");
const { verifySlackRequest } = require("../../utils/common");
const {
  SLACK_ACTIONS: { VIEW_SUBMISSION }
} = require("../../global/constants");

const router = express.Router();

// SLACK ACTIONS

// @route 	GET api/v1/slack-action/health
// @desc   	Health check for slack-actions route
// @access 	Public

router.get("/health", (req, res) =>
  res.json({ msg: "Slack-Actions are up and running!!!" })
);

// @route 	POST api/v1/slack-actions
// @desc    Create
// @access 	Protected

router.post("/", async (req, res) => {
  try {
    logger.debug("slack-actions -> req.body : ", JSON.stringify(req.body));

    const { payload } = req.body;
    const parsedPayload = JSON.parse(payload);

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

    logger.debug("parsedPayload : ", JSON.stringify(parsedPayload));

    const { type } = parsedPayload;

    if (type === VIEW_SUBMISSION) {
      res.status(200).send({
        response_action: "clear" // clear all views and close the modal
      });

      return await viewSubmissionHandler(parsedPayload);
    }
  } catch (error) {
    logger.error("/slack-actions -> error : ", error);
  }
});

module.exports = router;
