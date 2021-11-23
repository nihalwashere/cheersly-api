const createMovePlayedTemplate = (userId) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<@${userId}> has made the move. Waiting for the opponent to play.`
      }
    }
  ];
};

const createGameFinishedTemplate = (userId) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<@${userId}> WINS`
      }
    }
  ];
};

const moveAlreadyPlayedModalTemplate = () => ({
  type: "modal",
  title: {
    type: "plain_text",
    text: "Stone Paper Scissors",
    emoji: true
  },
  close: {
    type: "plain_text",
    text: "OK",
    emoji: true
  },
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*You have already played your move, it's your opponent's chance to play!*"
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "_Please ask your opponent to play._"
      }
    }
  ]
});

module.exports = {
  createMovePlayedTemplate,
  createGameFinishedTemplate,
  moveAlreadyPlayedModalTemplate
};
