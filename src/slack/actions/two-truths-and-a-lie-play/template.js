const getVoters = votes => {
  let voters = "";

  votes.forEach((vote, index) => {
    voters += index === 0 ? `<@${vote}>` : `, <@${vote}>`;
  });

  return voters;
};

const createTwoTruthsAndALieResultsView = ({
  blocks,
  correctVotes,
  wrongVotes,
}) => {
  return [
    { ...blocks[0] },
    { ...blocks[1] },
    { ...blocks[2] },
    { ...blocks[3] },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:white_check_mark: - ${
          correctVotes.length === 0
            ? "No one has got it correct so far..."
            : `${getVoters(correctVotes)}`
        }`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:x: - ${
          wrongVotes.length === 0
            ? "No one has got it wrong so far..."
            : `${getVoters(wrongVotes)}`
        }`,
      },
    },
  ];
};

const createResponseAlreadySubmittedView = ({ number, lie }) => ({
  type: "modal",
  title: {
    type: "plain_text",
    text: "Two truths and a lie",
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
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `The lie is Statement ${number} - *${lie}*`,
      },
    },
  ],
});

const createCorrectResponseView = ({ number, lie }) => ({
  type: "modal",
  title: {
    type: "plain_text",
    text: "Two truths and a lie",
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
        text: "*Whoa! You got it right!* :scream_cat:",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `The lie is Statement ${number} - *${lie}*`,
      },
    },
  ],
});

const createWrongResponseView = ({ number, lie }) => ({
  type: "modal",
  title: {
    type: "plain_text",
    text: "Two truths and a lie",
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
        text: "*Oops! You have got it wrong!* :crying_cat_face:",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `The lie is Statement ${number} - *${lie}*`,
      },
    },
  ],
});

module.exports = {
  createTwoTruthsAndALieResultsView,
  createResponseAlreadySubmittedView,
  createCorrectResponseView,
  createWrongResponseView,
};
