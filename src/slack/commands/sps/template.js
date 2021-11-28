const {
  BLOCK_IDS: { STONE_PAPER_SCISSORS },
  ACTION_IDS: { STONE_PLAYED, PAPER_PLAYED, SCISSORS_PLAYED },
} = require("../../../global/constants");

const createPlayStonePaperScissorsTemplate = (userId, gameId) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `<@${userId}> has challenged you to play a round of *Stone Paper Scissors*`,
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Pick your move :smiling_imp:",
    },
  },
  {
    type: "actions",
    block_id: STONE_PAPER_SCISSORS,
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Stone :punch:",
          emoji: true,
        },
        value: gameId,
        action_id: STONE_PLAYED,
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Paper :raised_hand_with_fingers_splayed:",
          emoji: true,
        },
        value: gameId,
        action_id: PAPER_PLAYED,
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Scissors :v:",
          emoji: true,
        },
        value: gameId,
        action_id: SCISSORS_PLAYED,
      },
    ],
  },
];

const createAllowedOnlyInDMTemplate = () => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*Oops! Stone Paper Scissors can be only be played in direct messages.*",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "Enter `/cheers sps` in a direct message with your co-worker to play.",
      },
    },
  ];
};

module.exports = {
  createPlayStonePaperScissorsTemplate,
  createAllowedOnlyInDMTemplate,
};
