const mongoose = require("mongoose");
const crypto = require("crypto");
const qs = require("qs");
const {
  addSubscription,
  getSubscriptionBySlackTeamId
} = require("../mongo/helper/subscriptions");
const {
  SubscriptionMessageType
} = require("../enums/subscriptionMessageTypes");
const logger = require("../global/logger");

const newIdString = () => mongoose.Types.ObjectId().toHexString();

const verifySlackRequest = (slackRequestTimestamp, slackSignature, body) => {
  try {
    const currentTime = Math.floor(new Date().getTime() / 1000);
    if (Math.abs(currentTime - slackRequestTimestamp) > 5 * 60) {
      return {
        error: true,
        status: 403,
        message: "You can't replay me!"
      };
    }

    const baseString = `v0:${slackRequestTimestamp}:${qs.stringify(body, {
      format: "RFC1738"
    })}`;

    // logger.debug("baseString : ", baseString);

    const hmac = crypto.createHmac("sha256", process.env.SLACK_SIGNING_SECRET);

    hmac.update(baseString);

    const digest = hmac.digest("hex");

    const appSignature = `v0=${digest}`;

    // logger.debug("appSignature : ", appSignature);

    if (slackSignature !== appSignature) {
      return {
        error: true,
        status: 403,
        message: "Nice try buddy!"
      };
    }

    return {
      error: false
    };
  } catch (error) {
    logger.error("verifySlackRequest() -> error : ", error);
  }
};

const waitForMilliSeconds = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getTrialEndDate = (date) => {
  // return date + 7 days
  return new Date(date.setDate(date.getDate() + 7));
};

const createTrialSubscription = async (slackTeamId) => {
  try {
    const now = new Date();
    const subscribedOn = new Date(now);
    const nextDueDate = getTrialEndDate(new Date(subscribedOn));
    const ultimateDueDate = nextDueDate;

    await addSubscription({
      isTrialPeriod: true,
      subscribedBy: null,
      subscribedOn,
      nextDueDate,
      ultimateDueDate,
      totalUsers: null,
      users: [],
      slackTeamId
    });
  } catch (error) {
    logger.error("createTrialSubscription() -> ", error);
  }
};

const isSubscriptionValidForSlack = async (slackTeamId) => {
  try {
    const subscription = await getSubscriptionBySlackTeamId(slackTeamId);

    if (!subscription) {
      return {
        hasSubscription: false,
        messageType: SubscriptionMessageType.TRIAL
      };
    }

    const now = new Date();

    if (
      !subscription.isTrialPeriod &&
      new Date(subscription.ultimateDueDate) > new Date(now)
    ) {
      return {
        hasSubscription: true,
        messageType: null
      };
    }

    if (
      subscription.isTrialPeriod &&
      new Date(subscription.ultimateDueDate) > new Date(now)
    ) {
      return {
        hasSubscription: true,
        messageType: null
      };
    }

    if (
      subscription.isTrialPeriod &&
      new Date(now) > new Date(subscription.ultimateDueDate)
    ) {
      return {
        hasSubscription: false,
        messageType: SubscriptionMessageType.TRIAL
      };
    }

    if (
      !subscription.isTrialPeriod &&
      new Date(now) > new Date(subscription.ultimateDueDate)
    ) {
      return {
        hasSubscription: false,
        messageType: SubscriptionMessageType.UPGRADE
      };
    }
  } catch (error) {
    logger.error(
      `isSubscriptionValidForSlack() : slackTeamId : ${slackTeamId} -> `,
      error
    );
  }
};

module.exports = {
  newIdString,
  verifySlackRequest,
  waitForMilliSeconds,
  createTrialSubscription,
  isSubscriptionValidForSlack
};
