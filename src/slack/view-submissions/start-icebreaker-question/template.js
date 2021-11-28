const createIcebreakerQuestionSubmittedTemplate = (userId, question) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<@${userId}> wants you to answer an ice-breaker question:`,
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
