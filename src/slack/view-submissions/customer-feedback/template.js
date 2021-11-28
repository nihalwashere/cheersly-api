const createFeedbackSubmissionSuccessTemplate = () => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Thanks for writing to us! We will get in touch shortly... :smiley:"
      }
    }
  ];
};

module.exports = { createFeedbackSubmissionSuccessTemplate };
