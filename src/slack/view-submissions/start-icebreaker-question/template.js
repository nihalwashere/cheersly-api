const createIcebreakerQuestionSubmittedTemplate = (userId, question) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<@${userId}> has asked an ice-breaker question, share your thoughts!`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${question}*`,
      },
    },
  ];
};

module.exports = { createIcebreakerQuestionSubmittedTemplate };
