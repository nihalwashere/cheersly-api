const { createSupportContextTemplate } = require("../templates");

const createMyStatsSection = (
  cheersGiven,
  cheersReceived,
  cheersRedeemable
) => {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `Given: *${cheersGiven}*   |   Received: *${cheersReceived}*   |   Redeemable: *${cheersRedeemable}*`,
    },
  };
};

const createAppHomeLeadersSection = leaders => {
  const blocks = [];

  const n = 10;

  const result = new Array(Math.ceil(leaders.length / n))
    .fill()
    .map(() => leaders.splice(0, n));

  let leaderBoardString = "";

  for (let i = 0; i < result.length; i++) {
    const leaderArr = result[i];

    for (let j = 0; j < leaderArr.length; j++) {
      const leader = leaderArr[j];

      const { slackUsername, cheersReceived } = leader;

      leaderBoardString +=
        "-  @" + slackUsername + "  (" + cheersReceived + ") \n";
    }

    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: leaderBoardString,
      },
    });
  }

  return blocks;
};

const createAppHomeLeaderBoard = leaders => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Leaderboard* :trophy:",
      },
    },
    {
      type: "divider",
    },
    ...createAppHomeLeadersSection(leaders),
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "\n \n",
      },
    },
    createSupportContextTemplate(),
  ];
};

const createAppHomeTemplate = (
  url,
  cheersGiven,
  cheersReceived,
  cheersRedeemable,
  appHomeBlocks
) => {
  const appHomeTemplate = {
    type: "home",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*My Cheers* :beers:",
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "App Dashboard",
            emoji: true,
          },
          url,
        },
      },
      {
        type: "divider",
      },
      createMyStatsSection(cheersGiven, cheersReceived, cheersRedeemable),
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "\n \n",
        },
      },
    ],
  };

  if (appHomeBlocks && appHomeBlocks.blocks.length) {
    appHomeBlocks.blocks.map(block => {
      appHomeTemplate.blocks.push(block);
    });
  }

  appHomeTemplate.blocks = [
    ...appHomeTemplate.blocks,
    ...[
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: ":ice_cube: *Icebreakers*",
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":fencer: This or that",
              emoji: true,
            },
            value: "click_me_123",
            action_id: "actionId-0",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":question: Icebreaker question",
              emoji: true,
            },
            value: "click_me_123",
            action_id: "actionId-1",
          },
        ],
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*:video_game:  2-player games*",
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":x: Tic Tac Toe :o:",
              emoji: true,
            },
            value: "click_me_123",
            action_id: "actionId-2",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":v: Stone Paper Scissors",
              emoji: true,
            },
            value: "click_me_123",
            action_id: "actionId-3",
          },
        ],
      },
    ],
  ];

  return appHomeTemplate;
};

module.exports = { createAppHomeLeaderBoard, createAppHomeTemplate };
