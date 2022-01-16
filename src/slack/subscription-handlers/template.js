const createTrialEndedTemplate = () => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "Your Cheersly trial has ended! Cheersly misses your team dearly and his life is meaningless without you :heart:. You can check our pricing plans <https://cheersly.club/pricing|here>. Please contact support to upgrade your subscription and we will set you up!",
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "Need help? contact support@cheersly.club",
        },
      ],
    },
  ];
};

const createUpgradeSubscriptionTemplate = () => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "Your Cheersly subscription has expired! Cheersly misses your team dearly and he cannot stop thinking about you :heart:. You can check our pricing plans <https://cheersly.club/pricing|here>. Please contact support to upgrade your subscription and we will set you up!",
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "Need help? contact support@cheersly.club",
        },
      ],
    },
  ];
};

module.exports = {
  createTrialEndedTemplate,
  createUpgradeSubscriptionTemplate,
};
