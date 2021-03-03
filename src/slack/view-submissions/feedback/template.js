const createFeedbackSubmittedTemplate = (user_name, feedback) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `@${user_name} submitted a Feedback`
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Feedback: *${feedback}*`
      }
    }
  ];
};

module.exports = { createFeedbackSubmittedTemplate };
