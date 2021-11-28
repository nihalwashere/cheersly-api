const createTicTacToeHelpView = () => ({
  type: "modal",
  title: {
    type: "plain_text",
    text: "Tic Tac Toe Help",
    emoji: true,
  },
  close: {
    type: "plain_text",
    text: "OK",
    emoji: true,
  },
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Hey there! :wave: Let's play *Tic Tac Toe!!!*",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "To start a two-player game of *Tic Tac Toe*, enter the slash command `/cheers ttt` in a direct message.",
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "_Please note,_",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: ":point_right: Tic Tac Toe is a 2-player game.",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          ":point_right: Can only be played amongst two players in a direct message and not in channels.",
      },
    },
  ],
});

module.exports = { createTicTacToeHelpView };
