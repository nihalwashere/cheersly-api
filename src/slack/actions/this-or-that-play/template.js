const getVoters = votes => {
  let voters = "";

  votes.forEach((vote, index) => {
    voters += index === 0 ? `<@${vote}>` : `, <@${vote}>`;
  });

  return voters;
};

const voteOrVotes = votes => (votes.length > 1 ? "votes" : "vote");

const createThisOrThatResultsView = (blocks, question, votes) => {
  return [
    { ...blocks[0] },
    { ...blocks[1] },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${question.this.value}*: ${
          votes.this.length === 0
            ? `No votes yet`
            : `${votes.this.length} ${voteOrVotes(votes.this)} - ${getVoters(
                votes.this
              )}`
        }`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${question.that.value}*: ${
          votes.that.length === 0
            ? `No votes yet`
            : `${votes.that.length} ${voteOrVotes(votes.that)} - ${getVoters(
                votes.that
              )}`
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
