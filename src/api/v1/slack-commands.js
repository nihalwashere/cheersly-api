const express = require("express");

const router = express.Router();

const {
  verifySlackRequest
  // isSubscriptionValidForSlack
} = require("../../utils/common");
const { isHelpCommand } = require("../../slack/commands/help");
const { createHelpTemplate } = require("../../slack/commands/help/template");
const {
  isOnboardCommand,
  handleOnboardCommand
} = require("../../slack/commands/onboard");
const {
  isCheersCommand,
  handleCheersCommand
} = require("../../slack/commands/cheers");
const {
  isPollCommand,
  handlePollCommand
} = require("../../slack/commands/poll");
const {
  isFeedbackCommand,
  handleFeedbackCommand
} = require("../../slack/commands/feedback");
// const {
//   upgradeSubscriptionMessage,
//   trialEndedMessage
// } = require("../../slack/subscription-handlers");
// const {
//   SubscriptionMessageType
// } = require("../../enums/subscriptionMessageTypes");
// const { updateAppHomePublishedForTeam } = require("../../mongo/helper/user");
const { APP_NAME } = require("../../global/config");
const { PROD_APP_URL, DEV_APP_URL } = require("../../global/constants");
const logger = require("../../global/logger");

router.post("/", async (req, res) => {
  try {
    logger.debug("req.body : ", req.body);

    let isCommandValid = false;

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

    const { team_id, channel_id, user_name, trigger_id, text } = req.body;

    const url = String(APP_NAME).includes("-dev") ? DEV_APP_URL : PROD_APP_URL;

    if (isHelpCommand(text)) {
      // /cheers help

      return res.status(200).json({
        response_type: "ephemeral",
        blocks: createHelpTemplate(url)
      });
    }

    if (isOnboardCommand(text)) {
      // /cheers onboard

      isCommandValid = true;

      res.send("");

      return await handleOnboardCommand(team_id, channel_id);
    }

    // verify subscription

    // const subscriptionInfo = await isSubscriptionValidForSlack(team_id);

    // if (!subscriptionInfo.hasSubscription) {
    //   res.send("");

    //   await updateAppHomePublishedForTeam(team_id, false);

    //   if (subscriptionInfo.messageType === SubscriptionMessageType.TRIAL) {
    //     return await trialEndedMessage(team_id, channel_id);
    //   }

    //   return await upgradeSubscriptionMessage(team_id, channel_id);
    // }

    if (isCheersCommand(text)) {
      // /cheers

      isCommandValid = true;

      res.send("");

      return await handleCheersCommand(team_id, user_name, trigger_id);
    }

    if (isPollCommand(text)) {
      // /cheers poll

      isCommandValid = true;

      res.send("");

      return await handlePollCommand(team_id, user_name, trigger_id);
    }

    if (isFeedbackCommand(text)) {
      // /cheers feedback

      isCommandValid = true;

      res.send("");

      return await handleFeedbackCommand(team_id, user_name, trigger_id);
    }

    if (!isCommandValid) {
      // /cheers help

      return res.status(200).json({
        response_type: "ephemeral",
        blocks: createHelpTemplate(url)
      });
    }
  } catch (error) {
    logger.error("/slack-commands -> error : ", error);
  }
});

module.exports = router;
