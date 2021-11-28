const createUserSection = (user_name, isAnonymous) => {
  let text = `*@${user_name} shared a feedback*`;

  if (isAnonymous) {
    text = "*Someone shared a feedback*";
  }

  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text,
    },
  };
};

const createFeedbackSubmittedTemplate = (user_name, feedback, isAnonymous) => {
  return [
    createUserSection(user_name, isAnonymous),
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: feedback,
      },
    },
  ];
};

module.exports = { createFeedbackSubmittedTemplate };
