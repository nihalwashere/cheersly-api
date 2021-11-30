const {
  BLOCK_IDS: {
    THIS_OR_THAT_PLAYED_SET_ONE,
    THIS_OR_THAT_PLAYED_SET_TWO,
    THIS_OR_THAT_PLAYED_SET_THREE,
  },
  ACTION_IDS: { THIS, THAT },
} = require("../../../global/constants");

const mapSetToIndex = index => {
  if (index === 0) {
    return THIS_OR_THAT_PLAYED_SET_ONE;
  }

  if (index === 1) {
    return THIS_OR_THAT_PLAYED_SET_TWO;
  }

  if (index === 2) {
    return THIS_OR_THAT_PLAYED_SET_THREE;
  }
};

const createThisOrThatSubmittedTemplate = (userId, questions) => {
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<@${userId}> has invited you to play *This or That*`,
      },
    },
    {
      type: "divider",
    },
  ];

  questions.map((question, index) => {
    const { this: thisQuestion, that: thatQuestion } = question;

    blocks.push({
      type: "actions",
      block_id: mapSetToIndex(index),
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: thisQuestion.value,
            emoji: true,
          },
          value: thisQuestion.id,
          action_id: THIS,
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: thatQuestion.value,
            emoji: true,
          },
          value: thatQuestion.id,
          action_id: THAT,
        },
      ],
    });

    blocks.push({
      type: "divider",
    });
  });

  return blocks;
};

module.exports = { createThisOrThatSubmittedTemplate };
