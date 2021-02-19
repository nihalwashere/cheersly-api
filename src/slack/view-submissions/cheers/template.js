const createCheersSubmittedTemplate = (user_name) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `@${user_name} shared some cheers`
      }
    }
  ];
};

module.exports = { createCheersSubmittedTemplate };
