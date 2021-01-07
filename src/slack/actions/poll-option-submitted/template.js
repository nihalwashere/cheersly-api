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

const createPollOptionAlreadySubmittedTemplate = () => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "You have already polled for this option!"
      }
    }
  ];
};

const createPollOptionUpdatedTemplate = () => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Your poll has been updated!"
      }
    }
  ];
};

module.exports = {
  createPollOptionSubmittedTemplate,
  createPollOptionAlreadySubmittedTemplate,
  createPollOptionUpdatedTemplate
};
