const Subscriptions = require("../models/Subscriptions");
const logger = require("../../global/logger");

const addSubscription = async payload => {
  try {
    return await new Subscriptions(payload).save();
  } catch (error) {
    logger.error(
      "addSubscription() -> Failed to add subscription -> error : ",
      error
    );
  }
};

const getTrialSubscriptionForSlackTeam = async teamId => {
  try {
    return await Subscriptions.findOne({
      teamId,
      isTrialPeriod: true,
    });
  } catch (error) {
    logger.error(
      `getTrialSubscriptionForSlackTeam() : teamId : ${teamId} -> error : `,
      error
    );
  }
};

const getSubscriptionBySlackTeamId = async teamId => {
  try {
    return await Subscriptions.findOne({ teamId }).sort({
      expiresOn: -1,
    });
  } catch (error) {
    logger.error(
      `getSubscriptionBySlackTeamId() : teamId : ${teamId} -> `,
      error
    );
  }
};

module.exports = {
  addSubscription,
  getSubscriptionBySlackTeamId,
  getTrialSubscriptionForSlackTeam,
};
