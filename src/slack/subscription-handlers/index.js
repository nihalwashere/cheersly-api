const {
  createTrialEndedTemplate,
  createUpgradeSubscriptionTemplate,
} = require("../templates");
const { postEphemeralMessage } = require("../api");
const logger = require("../../global/logger");

const trialEndedMessage = async (teamId, userId, channelId) => {
  try {
    return await postEphemeralMessage(
      channelId,
      userId,
      teamId,
      createTrialEndedTemplate()
    );
  } catch (error) {
    logger.error("trialEndedMessage() -> ", error);
  }
};

const upgradeSubscriptionMessage = async (teamId, userId, channelId) => {
  try {
    return await postEphemeralMessage(
      channelId,
      userId,
      teamId,
      createUpgradeSubscriptionTemplate()
    );
  } catch (error) {
    logger.error("upgradeSubscriptionMessage() -> ", error);
  }
};

module.exports = { trialEndedMessage, upgradeSubscriptionMessage };
