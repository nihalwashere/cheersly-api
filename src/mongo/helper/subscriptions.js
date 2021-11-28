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

const getTrialSubscriptionForSlackTeam = async slackTeamId => {
  try {
    return await Subscriptions.findOne({
      slackTeamId,
      isTrialPeriod: true,
    });
  } catch (error) {
    logger.error(
      `getTrialSubscriptionForSlackTeam() : slackTeamId : ${slackTeamId} -> error : `,
      error
    );
  }
};

const getSubscriptionBySlackTeamId = async slackTeamId => {
  try {
    return await Subscriptions.findOne({ slackTeamId }).sort({
      nextDueDate: -1,
    });
  } catch (error) {
    logger.error(
      `getSubscriptionBySlackTeamId() : slackTeamId : ${slackTeamId} -> `,
      error
    );
  }
};

module.exports = {
  addSubscription,
  getSubscriptionBySlackTeamId,
  getTrialSubscriptionForSlackTeam,
};
