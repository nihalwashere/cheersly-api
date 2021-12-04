const createFirstMovePlayedTemplate = ({
  currentPlayer,
  row,
  column,
  blocks,
}) => {
  blocks.splice(1, 0, {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `<@${currentPlayer}> has made their move. Waiting for the opponent to play.`,
    },
  });

  blocks.splice(2, 1, {
    type: "section",
    text: {
      type: "mrkdwn",
      text: ":o:'s turn",
    },
  });

  if (row === 1) {
    // first row

    blocks.splice(4, 1, {
      ...blocks[4],
      elements: blocks[4].elements.splice(column - 1, 1, {
        ...blocks[4].elements[column - 1],
        text: {
          ...blocks[4].elements[column - 1].text,
          text: ":x:",
        },
      }),
    });
  }

  if (row === 2) {
    // second row

    blocks.splice(5, 1, {
      ...blocks[5],
      elements: blocks[5].elements.splice(column - 1, 1, {
        ...blocks[5].elements[column - 1],
        text: {
          ...blocks[5].elements[column - 1].text,
          text: ":x:",
        },
      }),
    });
  }

  if (row === 3) {
    // third row

    blocks.splice(6, 1, {
      ...blocks[6],
      elements: blocks[6].elements.splice(column - 1, 1, {
        ...blocks[6].elements[column - 1],
        text: {
          ...blocks[6].elements[column - 1].text,
          text: ":x:",
        },
      }),
    });
  }

  return blocks;
};

const createSecondMovePlayedTemplate = (playerOne, playerTwo, blocks) => {
  blocks.splice(0, 1, {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `<@${playerOne}> :x: v/s <@${playerTwo}> :o:`,
    },
  });

  blocks.splice(1, 1, {
    type: "section",
    text: {
      type: "mrkdwn",
      text: ":x:'s turn",
    },
  });

  blocks.splice(2, 1);

  return blocks;
};

const createGameFinishedTemplate = ({
  winner,
  winnerMoveEmoji,
  loser,
  loserMoveEmoji,
}) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<@${winner}>'s ${winnerMoveEmoji} beats <@${loser}>'s ${loserMoveEmoji}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*_<@${winner}> wins!_* :confetti_ball:`,
      },
    },
  ];
};

const createGameDrawedTemplate = (playerOne, playerTwo, move) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<@${playerOne}> and <@${playerTwo}> both played ${move}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Game is drawed :handshake:",
      },
    },
  ];
};

const moveAlreadyPlayedModalTemplate = () => ({
  type: "modal",
  title: {
    type: "plain_text",
    text: "Tic Tac Toe",
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
        text:
          "*You have already played your move, it's your opponent's chance to play!*",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "_Please ask your opponent to make their move_ :smiling_imp:",
      },
    },
  ],
});

const updateTicTacToeTemplate = blocks => {
  return [];
};

module.exports = {
  createFirstMovePlayedTemplate,
  createSecondMovePlayedTemplate,
  createGameFinishedTemplate,
  createGameDrawedTemplate,
  moveAlreadyPlayedModalTemplate,
  updateTicTacToeTemplate,
};
