const {
  BLOCK_IDS: { THIS_OR_THAT_PLAYED },
  ACTION_IDS: { THIS, THAT },
} = require("../../../global/constants");

const createThisOrThatSubmittedTemplate = (userId, gameId, question) => {
  const { this: thisQuestion, that: thatQuestion } = question;

  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<@${userId}> has invited you to play *This or That*`,
      },
    },
    {
      type: "actions",
      block_id: THIS_OR_THAT_PLAYED,
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: thisQuestion.value,
            emoji: true,
          },
          value: thisQuestion.id,
          action_id: `${THIS}-${gameId}`,
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: thatQuestion.value,
            emoji: true,
          },
          value: thatQuestion.id,
          action_id: `${THAT}-${gameId}`,
        },
      ],
    },
  ];
};

module.exports = { createThisOrThatSubmittedTemplate };
