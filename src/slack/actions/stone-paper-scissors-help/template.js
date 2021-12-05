const createStonePaperScissorsHelpView = () => ({
  type: "modal",
  title: {
    type: "plain_text",
    text: "SPS Help",
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
        text: "Hey there! :wave: Let's play *Stone Paper Scissors!!!*",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "To start a two-player game of *Stone Paper Scissors*, enter the slash command `/cheers sps` in a direct message.",
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
        text: ":point_right: Stone Paper Scissors is a 2-player game.",
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

module.exports = { createStonePaperScissorsHelpView };
