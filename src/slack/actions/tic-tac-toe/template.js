const updateElements = (elements, column, turn) =>
  elements.map((elem, index) => {
    if (index === column) {
      return {
        ...elem,
        text: {
          ...elem.text,
          text: turn,
        },
      };
    }

    return { ...elem };
  });

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

    blocks.splice(3, 1, {
      ...blocks[3],
      elements: updateElements(blocks[3].elements, column - 1, ":x:"),
    });
  }

  if (row === 2) {
    // second row

    blocks.splice(4, 1, {
      ...blocks[4],
      elements: updateElements(blocks[4].elements, column - 1, ":x:"),
    });
  }

  if (row === 3) {
    // third row

    blocks.splice(5, 1, {
      ...blocks[5],
      elements: updateElements(blocks[5].elements, column - 1, ":x:"),
    });
  }

  return blocks;
};

const createSecondMovePlayedTemplate = ({
  playerOne,
  playerTwo,
  row,
  column,
  blocks,
}) => {
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

  if (row === 1) {
    // first row

    blocks.splice(2, 1, {
      ...blocks[2],
      elements: updateElements(blocks[2].elements, column - 1, ":o:"),
    });
  }

  if (row === 2) {
    // second row

    blocks.splice(3, 1, {
      ...blocks[3],
      elements: updateElements(blocks[3].elements, column - 1, ":o:"),
    });
  }

  if (row === 3) {
    // third row

    blocks.splice(4, 1, {
      ...blocks[4],
      elements: updateElements(blocks[4].elements, column - 1, ":o:"),
    });
  }

  return blocks;
};

const updateTicTacToeTemplate = ({
  row,
  column,
  blocks,
  currentTurn,
  nextTurn,
}) => {
  blocks.splice(1, 1, {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `${nextTurn}'s turn`,
    },
  });

  if (row === 1) {
    // first row

    blocks.splice(2, 1, {
      ...blocks[2],
      elements: updateElements(blocks[2].elements, column - 1, currentTurn),
    });
  }

  if (row === 2) {
    // second row

    blocks.splice(3, 1, {
      ...blocks[3],
      elements: updateElements(blocks[3].elements, column - 1, currentTurn),
    });
  }

  if (row === 3) {
    // third row

    blocks.splice(4, 1, {
      ...blocks[4],
      elements: updateElements(blocks[4].elements, column - 1, currentTurn),
    });
  }

  return blocks;
};

const createGameFinishedRow = elements => {
  let text = "";

  elements.map(elem => {
    if (elem.text.text === ":x:") {
      text += ":x:            ";
    }

    if (elem.text.text === ":o:") {
      text += ":o:            ";
    }

    if (elem.text.text === ":question:") {
      text += ":question:            ";
    }
  });

  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text,
    },
  };
};

const createGameFinishedTemplate = ({ winner, blocks }) => {
  blocks.splice(1, 1, {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `<@${winner}> is the winner :tada: :partying_face:`,
    },
  });

  // first row
  blocks.splice(2, 1, {
    ...createGameFinishedRow(blocks[2].elements),
  });

  // second row
  blocks.splice(3, 1, {
    ...createGameFinishedRow(blocks[3].elements),
  });

  // third row
  blocks.splice(4, 1, {
    ...createGameFinishedRow(blocks[4].elements),
  });

  return blocks;
};

const createGameDrawedTemplate = blocks => {
  blocks.splice(1, 1, {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Game is drawed :zany_face:",
    },
  });

  // first row
  blocks.splice(2, 1, {
    ...createGameFinishedRow(blocks[2].elements),
  });

  // second row
  blocks.splice(3, 1, {
    ...createGameFinishedRow(blocks[3].elements),
  });

  // third row
  blocks.splice(4, 1, {
    ...createGameFinishedRow(blocks[4].elements),
  });

  return blocks;
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

const positionAlreadyTakenModalTemplate = () => ({
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
        text: "*That position is already taken, please play a different move!*",
      },
    },
  ],
});

module.exports = {
  createFirstMovePlayedTemplate,
  createSecondMovePlayedTemplate,
  updateTicTacToeTemplate,
  createGameFinishedTemplate,
  createGameDrawedTemplate,
  moveAlreadyPlayedModalTemplate,
  positionAlreadyTakenModalTemplate,
};
