const {
  BLOCK_IDS: { STONE_PAPER_SCISSORS },
  ACTION_IDS: { STONE_PLAYED, PAPER_PLAYED, SCISSORS_PLAYED }
} = require("../../../global/constants");

const createPlayStonePaperScissorsTemplate = (user_name) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `@${user_name} has challenged you to play a round of *Stone - Paper - Scissors*`
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Pick your move"
    }
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
          emoji: true
        },
        value: `${STONE_PLAYED}-${user_name}`,
        action_id: STONE_PLAYED
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Paper :raised_hand_with_fingers_splayed:",
          emoji: true
        },
        value: `${PAPER_PLAYED}-${user_name}`,
        action_id: PAPER_PLAYED
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Scissors :v:",
          emoji: true
        },
        value: `${SCISSORS_PLAYED}-${user_name}`,
        action_id: SCISSORS_PLAYED
      }
    ]
  }
];

module.exports = { createPlayStonePaperScissorsTemplate };
