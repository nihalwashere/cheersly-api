const createFirstMovePlayedTemplate = (currentPlayer, blocks) => {
  return blocks.splice(1, 0, {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `<@${currentPlayer}> has made their move. Waiting for the opponent to play.`,
    },
  });
};

const createSecondMovePlayedTemplate = (playerOne, playerTwo, blocks) => {
  blocks.splice(0, 0, {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `<@${playerOne}> :x: v/s <@${playerTwo}> :o:`,
    },
  });

  blocks.splice(1, 0, {
    type: "section",
    text: {
      type: "mrkdwn",
      text: ":x:'s turn",
    },
  });
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

module.exports = {
  createFirstMovePlayedTemplate,
  createSecondMovePlayedTemplate,
  createGameFinishedTemplate,
  createGameDrawedTemplate,
  moveAlreadyPlayedModalTemplate,
};
