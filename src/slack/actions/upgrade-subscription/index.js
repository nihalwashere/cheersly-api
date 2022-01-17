const { openModal } = require("../../api");
const {
  SubscriptionMessageType,
} = require("../../../enums/subscriptionMessageTypes");
const { createUpgradeSubscriptionView } = require("./template");
const logger = require("../../../global/logger");

const handleUpgradeSubscription = async (payload, subscriptionInfo) => {
  try {
    const {
      trigger_id,
      team: { id: teamId },
    } = payload;

    let isTrialPlan = true;

    if (subscriptionInfo.messageType !== SubscriptionMessageType.TRIAL) {
      isTrialPlan = false;
    }

    await openModal(
      teamId,
      trigger_id,
      createUpgradeSubscriptionView(isTrialPlan)
    );
  } catch (error) {
    logger.error("handleUpgradeSubscription() -> error : ", error);
  }
};

module.exports = { handleUpgradeSubscription };
