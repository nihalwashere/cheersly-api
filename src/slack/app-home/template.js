const createMyStatsSection = (
  cheersGiven,
  cheersReceived,
  cheersRedeemable
) => {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `Given: *${cheersGiven}*   |   Received: *${cheersReceived}*   |   Redeemable: *${cheersRedeemable}*`
    }
  };
};

const createAppHomeLeadersSection = (leaders) => {
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
        text: leaderBoardString
      }
    });
  }

  return blocks;
};

const createAppHomeLeaderBoard = (leaders) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Leaderboard* :trophy:"
      }
    },
    {
      type: "divider"
    },
    ...createAppHomeLeadersSection(leaders),
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "\n \n"
      }
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "Need help? contact support@cheersly.club"
        }
      ]
    }
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
          text: "*My Cheers* :beers:"
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "App Dashboard",
            emoji: true
          },
          url
        }
      },
      {
        type: "divider"
      },
      createMyStatsSection(cheersGiven, cheersReceived, cheersRedeemable),
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "\n \n"
        }
      }
    ]
  };

  if (appHomeBlocks && appHomeBlocks.blocks.length) {
    appHomeBlocks.blocks.map((block) => {
      appHomeTemplate.blocks.push(block);
    });
  }

  return appHomeTemplate;
};

module.exports = { createAppHomeLeaderBoard, createAppHomeTemplate };
