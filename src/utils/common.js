const R = require("ramda");
const mongoose = require("mongoose");
const crypto = require("crypto");
const { APP_URL, SLACK_APP_ID } = require("../global/config");
const {
  addSubscription,
  getSubscriptionBySlackTeamId,
} = require("../mongo/helper/subscriptions");
const { getUserDataBySlackUserId } = require("../mongo/helper/user");
const { getAuthDataForSlackTeam } = require("../mongo/helper/auth");
const {
  SubscriptionMessageType,
} = require("../enums/subscriptionMessageTypes");
const { decodeJWT } = require("./jwt");
const logger = require("../global/logger");

const newIdString = () => mongoose.Types.ObjectId().toHexString();

const verifySlackRequest = (slackRequestTimestamp, slackSignature, rawBody) => {
  try {
    const currentTime = Math.floor(new Date().getTime() / 1000);
    if (Math.abs(currentTime - slackRequestTimestamp) > 5 * 60) {
      return {
        error: true,
        status: 403,
        message: "You can't replay me!",
      };
    }

    const baseString = `v0:${slackRequestTimestamp}:${rawBody}`;

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
        message: "Nice try buddy!",
      };
    }

    return {
      error: false,
    };
  } catch (error) {
    logger.error("verifySlackRequest() -> error : ", error);
  }
};

const waitForMilliSeconds = ms =>
  new Promise(resolve => setTimeout(resolve, ms));

// return date + 14 days
const getTrialEndDate = date => new Date(date.setDate(date.getDate() + 14));

const createTrialSubscription = async slackTeamId => {
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
      slackTeamId,
    });
  } catch (error) {
    logger.error("createTrialSubscription() -> ", error);
  }
};

const isSubscriptionValidForSlack = async slackTeamId => {
  try {
    const subscription = await getSubscriptionBySlackTeamId(slackTeamId);

    if (!subscription) {
      return {
        hasSubscription: false,
        messageType: SubscriptionMessageType.TRIAL,
      };
    }

    const now = new Date();

    if (
      !subscription.isTrialPeriod &&
      new Date(subscription.ultimateDueDate) > new Date(now)
    ) {
      return {
        hasSubscription: true,
        messageType: null,
      };
    }

    if (
      subscription.isTrialPeriod &&
      new Date(subscription.ultimateDueDate) > new Date(now)
    ) {
      return {
        hasSubscription: true,
        messageType: null,
      };
    }

    if (
      subscription.isTrialPeriod &&
      new Date(now) > new Date(subscription.ultimateDueDate)
    ) {
      return {
        hasSubscription: false,
        messageType: SubscriptionMessageType.TRIAL,
      };
    }

    if (
      !subscription.isTrialPeriod &&
      new Date(now) > new Date(subscription.ultimateDueDate)
    ) {
      return {
        hasSubscription: false,
        messageType: SubscriptionMessageType.UPGRADE,
      };
    }
  } catch (error) {
    logger.error(
      `isSubscriptionValidForSlack() : slackTeamId : ${slackTeamId} -> `,
      error
    );
  }
};

const sortLeaders = R.sortWith([R.descend(R.prop("cheersReceived"))]);

const validateToken = async headers => {
  const token = headers["x-access-token"];

  if (!token) {
    return {
      success: false,
      message: "Token is required.",
    };
  }

  const decodedToken = decodeJWT(token);

  const { userId = null, teamId = null } = decodedToken;

  if (!userId || !teamId) {
    return {
      success: false,
      message: "Invalid token.",
    };
  }

  const user = await getUserDataBySlackUserId(userId);

  if (!user) {
    return {
      success: false,
      message: "User not found.",
    };
  }

  const auth = await getAuthDataForSlackTeam(teamId);

  if (!auth) {
    return {
      success: false,
      message: "Team not found.",
    };
  }

  return {
    success: true,
    data: {
      user: {
        role: user.role,
        slackUserData: user.slackUserData,
      },
    },
  };
};

const getMedalType = place => {
  switch (place) {
    case 0:
      return ":first_place_medal:";

    case 1:
      return ":second_place_medal:";

    case 2:
      return ":third_place_medal:";

    default:
      return "";
  }
};

const processTopCheersReceivers = cheers => {
  const leaders = [];

  const uniqueUsers = [];

  cheers.map(cheer => {
    const foundUser = uniqueUsers.find(user => user === cheer.to);

    if (!foundUser) {
      uniqueUsers.push(cheer.to);
    }
  });

  // count cheers for each unique user

  uniqueUsers.map(user => {
    let cheersReceived = 0;

    cheers.map(cheer => {
      if (cheer.to === user) {
        cheersReceived += 1;
      }
    });

    leaders.push({ slackUserName: user, cheersReceived });
  });

  const sortedLeaders = sortLeaders(leaders);

  return sortedLeaders;
};

const getUnique = data => R.uniq(data);

const getAppUrl = () => APP_URL;

const getAppHomeLink = teamId =>
  `<slack://app?team=${teamId}&id=${SLACK_APP_ID}&tab=home|home>`;

const getAppHomeUrl = teamId =>
  `slack://app?team=${teamId}&id=${SLACK_APP_ID}&tab=home`;

const getChannelDeepLink = (teamId, channelId) =>
  `slack://channel?team=${teamId}&id=${channelId}`;

const shuffle = array => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    // eslint-disable-next-line
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

module.exports = {
  newIdString,
  verifySlackRequest,
  waitForMilliSeconds,
  createTrialSubscription,
  isSubscriptionValidForSlack,
  sortLeaders,
  validateToken,
  getMedalType,
  processTopCheersReceivers,
  getUnique,
  getAppUrl,
  getAppHomeLink,
  getAppHomeUrl,
  getChannelDeepLink,
  shuffle,
};
