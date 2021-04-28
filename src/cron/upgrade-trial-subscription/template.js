const createUpgradeTrialSubscriptionReminderTemplate = (days) => {
  const dayOrDays = days > 1 ? "days" : "day";

  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Hey there :wave:! Your *Cheersly* trial is about to end in ${days} ${dayOrDays}. Upgrade now to the PRO plan so that you can keep sharing cheers with your peers!`
      }
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "Want to upgrade? contact support@cheersly.club"
        }
      ]
    }
  ];
};

module.exports = { createUpgradeTrialSubscriptionReminderTemplate };
