const getVoters = votes => {
  let voters = "";

  votes.forEach((vote, index) => {
    voters += index === 0 ? `<@${vote}>` : `, <@${vote}>`;
  });

  console.log("voters : ", voters);

  return voters;
};

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
          votes.length === 0
            ? `No votes yet`
            : `${votes.this.length} vote - ${getVoters(votes.this)}`
        }`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${question.that.value}*: ${
          votes.length === 0
            ? `No votes yet`
            : `${votes.that.length} vote - ${getVoters(votes.that)}`
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
