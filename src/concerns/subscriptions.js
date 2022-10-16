const SubscriptionsModel = require("../mongo/models/Subscriptions");
const { createCustomer } = require("../stripe");
const logger = require("../global/logger");

const createTrialSubscription = async (teamId, teamName, authedUserEmail) => {
  try {
    const now = new Date();

    const subscribedOn = new Date(now);

    const expiresOn = new Date(
      new Date(subscribedOn).setDate(new Date(subscribedOn).getDate() + 30)
    );

    const customer = await createCustomer(teamName, authedUserEmail);

    await new SubscriptionsModel({
      isTrialPeriod: true,
      subscribedOn,
      expiresOn,
      teamId,
      customerId: customer.id,
    }).save();
  } catch (error) {
    logger.error("createTrialSubscription() -> ", error);
  }
};

module.exports = { createTrialSubscription };
