const createTrialEndedTemplate = () => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "Your Cheersly trial has ended! Cheersly misses your team dearly and his life is meaningless without you :heart: \n Please contact support to upgrade your subscription or extend your trial (if needed) and we will set you up!"
      }
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "Need help? contact support@cheersly.club"
        }
      ]
    }
  ];
};

const createUpgradeSubscriptionTemplate = () => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "Your Cheersly subscription has expired! Cheersly misses your team dearly and he cannot stop thinking about you :heart: \n Please contact support to upgrade your subscription and we will set you up!"
      }
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "Need help? contact support@cheersly.club"
        }
      ]
    }
  ];
};

module.exports = {
  createTrialEndedTemplate,
  createUpgradeSubscriptionTemplate
};
