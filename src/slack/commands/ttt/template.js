const {
  BLOCK_IDS: { TIC_TAC_TOE_ROW_1, TIC_TAC_TOE_ROW_2, TIC_TAC_TOE_ROW_3 },
  ACTION_IDS: {
    TIC_TAC_TOE_COLUMN_1,
    TIC_TAC_TOE_COLUMN_2,
    TIC_TAC_TOE_COLUMN_3,
  },
} = require("../../../global/constants");

const createPlayTicTacToeTemplate = (userId, gameId) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `<@${userId}> has challenged you to play a round of *Tic Tac Toe*`,
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: ":x:'s turn",
    },
  },
  {
    type: "actions",
    block_id: TIC_TAC_TOE_ROW_1,
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: ":question:",
          emoji: true,
        },
        value: gameId,
        action_id: TIC_TAC_TOE_COLUMN_1,
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: ":question:",
          emoji: true,
        },
        value: gameId,
        action_id: TIC_TAC_TOE_COLUMN_2,
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: ":question:",
          emoji: true,
        },
        value: gameId,
        action_id: TIC_TAC_TOE_COLUMN_3,
      },
    ],
  },
  {
    type: "actions",
    block_id: TIC_TAC_TOE_ROW_2,
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: ":question:",
          emoji: true,
        },
        value: gameId,
        action_id: TIC_TAC_TOE_COLUMN_1,
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: ":question:",
          emoji: true,
        },
        value: gameId,
        action_id: TIC_TAC_TOE_COLUMN_2,
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: ":question:",
          emoji: true,
        },
        value: gameId,
        action_id: TIC_TAC_TOE_COLUMN_3,
      },
    ],
  },
  {
    type: "actions",
    block_id: TIC_TAC_TOE_ROW_3,
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: ":question:",
          emoji: true,
        },
        value: gameId,
        action_id: TIC_TAC_TOE_COLUMN_1,
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: ":question:",
          emoji: true,
        },
        value: gameId,
        action_id: TIC_TAC_TOE_COLUMN_2,
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: ":question:",
          emoji: true,
        },
        value: gameId,
        action_id: TIC_TAC_TOE_COLUMN_3,
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
        text: "*Oops! Tic Tac Toe can only be played in direct messages.*",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "Enter `/cheers ttt` in a direct message with your co-worker to play.",
      },
    },
  ];
};

module.exports = {
  createPlayTicTacToeTemplate,
  createAllowedOnlyInDMTemplate,
};
