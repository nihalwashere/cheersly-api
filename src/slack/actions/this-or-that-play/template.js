const createThisOrThatResultsView = (blocks, question, votes) => {
  return [
    ...blocks,
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${question.this.value}*: ${
          votes.length === 0 ? `No votes yet` : `${votes.this.length} vote`
        }`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${question.that.value}*: ${
          votes.length === 0 ? `No votes yet` : `${votes.that.length} vote`
        }`,
      },
    },
  ];
};

const createResponseAlreadySubmittedView = () => ({
  type: "modal",
  title: {
    type: "plain_text",
    text: "This or That",
    emoji: true,
  },
  close: {
    type: "plain_text",
    text: "Okie Dokie",
    emoji: true,
  },
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*You have already submitted your response.*",
      },
    },
  ],
});

module.exports = {
  createThisOrThatResultsView,
  createResponseAlreadySubmittedView,
};
