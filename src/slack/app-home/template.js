const createMyStatsSection = (cheersGiven, cheersReceived) => {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        "Given: *" + cheersGiven + "*   |  Received: * " + cheersReceived + "*"
    }
  };
};

const createAppHomeLeadersSection = (leaders) => {
  let leaderBoardString = "";

  leaders.map((leader) => {
    const { slackUserId, cheersReceived } = leader;
    leaderBoardString += "@" + slackUserId + "  *" + cheersReceived + "* \n";
  });

  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: leaderBoardString
    }
  };
};

const createAppHomeLeaderBoard = (leaders) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Leaderboard*"
      }
    },
    {
      type: "divider"
    },
    ...createAppHomeLeadersSection(leaders),
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
  cheersGiven,
  cheersReceived,
  appHomeCommonBlocks
) => {
  const appHomeTemplate = {
    type: "home",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*My Cheers*"
        }
      },
      {
        type: "divider"
      },
      ...createMyStatsSection(cheersGiven, cheersReceived)
    ]
  };

  if (appHomeCommonBlocks) {
    appHomeTemplate.blocks.push(...appHomeCommonBlocks);
  }

  return appHomeTemplate;
};

module.exports = { createAppHomeLeaderBoard, createAppHomeTemplate };
