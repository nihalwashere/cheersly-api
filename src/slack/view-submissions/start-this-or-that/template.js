const {
  BLOCK_IDS: {
    THIS_OR_THAT_PLAYED_SET_ONE,
    THIS_OR_THAT_PLAYED_SET_TWO,
    THIS_OR_THAT_PLAYED_SET_THREE,
  },
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
            text: thisQuestion,
            emoji: true,
          },
          value: thisQuestion,
          action_id: `${thisQuestion}-${index}`,
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: thatQuestion,
            emoji: true,
          },
          value: thatQuestion,
          action_id: `${thatQuestion}-${index}`,
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
