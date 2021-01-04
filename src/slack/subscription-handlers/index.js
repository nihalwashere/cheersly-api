const {
  createTrialEndedTemplate,
  createUpgradeSubscriptionTemplate
} = require("./template");
const { slackPostMessageToChannel } = require("../api");
const logger = require("../../global/logger");

const trialEndedMessage = async (teamId, channel) => {
  try {
    const trialEndedTemplate = createTrialEndedTemplate();

    await slackPostMessageToChannel(channel, teamId, trialEndedTemplate, true);
  } catch (error) {
    logger.error("trialEndedMessage() -> ", error);
  }
};

const upgradeSubscriptionMessage = async (teamId, channel) => {
  try {
    const upgrageSubscriptionTemplate = createUpgradeSubscriptionTemplate();

    await slackPostMessageToChannel(
      channel,
      teamId,
      upgrageSubscriptionTemplate,
      true
    );
  } catch (error) {
    logger.error("upgradeSubscriptionMessage() -> ", error);
  }
};

module.exports = { trialEndedMessage, upgradeSubscriptionMessage };
