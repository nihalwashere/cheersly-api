const {
  BLOCK_IDS: { THIS_OR_THAT_PLAYED },
} = require("../../../global/constants");

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

  questions.map(question => {
    const { this: thisQuestion, that: thatQuestion } = question;

    blocks.push({
      type: "actions",
      block_id: THIS_OR_THAT_PLAYED,
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: thisQuestion,
            emoji: true,
          },
          value: thisQuestion,
          action_id: thisQuestion,
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: thatQuestion,
            emoji: true,
          },
          value: thatQuestion,
          action_id: thatQuestion,
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
