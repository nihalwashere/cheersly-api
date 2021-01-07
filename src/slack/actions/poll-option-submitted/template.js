const createPollOptionSubmittedTemplate = () => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Your poll has been submitted. Thanks!"
      }
    }
  ];
};

module.exports = { createPollOptionSubmittedTemplate };
