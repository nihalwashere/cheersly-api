const { trialEndedText, upgradeSubscriptionText } = require("../../templates");

const createUpgradeSubscriptionView = isTrialPlan => {
  let text = trialEndedText;

  if (!isTrialPlan) {
    text = upgradeSubscriptionText;
  }

  return {
    type: "modal",
    title: {
      type: "plain_text",
      text: "Upgrade Subscription",
      emoji: true,
    },
    submit: {
      type: "plain_text",
      text: "Okie Dokie",
      emoji: true,
    },
    close: {
      type: "plain_text",
      text: "Close",
      emoji: true,
    },
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text,
        },
      },
    ],
  };
};

module.exports = { createUpgradeSubscriptionView };
