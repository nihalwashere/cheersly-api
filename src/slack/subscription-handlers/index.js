const {
  createTrialEndedTemplate,
  createUpgradeSubscriptionTemplate,
} = require("./template");
const { slackPostMessageToChannel } = require("../api");
const logger = require("../../global/logger");

const trialEndedMessage = async (teamId, channel) => {
  try {
    return await slackPostMessageToChannel(
      channel,
      teamId,
      createTrialEndedTemplate()
    );
  } catch (error) {
    logger.error("trialEndedMessage() -> ", error);
  }
};

const upgradeSubscriptionMessage = async (teamId, channel) => {
  try {
    return await slackPostMessageToChannel(
      channel,
      teamId,
      createUpgradeSubscriptionTemplate(),
      true
    );
  } catch (error) {
    logger.error("upgradeSubscriptionMessage() -> ", error);
  }
};

module.exports = { trialEndedMessage, upgradeSubscriptionMessage };
