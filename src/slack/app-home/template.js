const createMyStatsSection = (cheersGiven, cheersReceived) => {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        "Given: *" + cheersGiven + "*   |   Received: * " + cheersReceived + "*"
    }
  };
};

const createAppHomeLeadersSection = (leaders) => {
  let leaderBoardString = "```";

  leaders.map((leader, index) => {
    const { slackUsername, cheersReceived } = leader;
    const row = index + 1;
    leaderBoardString +=
      row +
      ")  @" +
      slackUsername +
      "   |   Received : *" +
      cheersReceived +
      "* \n";
  });

  leaderBoardString += "```";

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
    createAppHomeLeadersSection(leaders),
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

const createAppHomeTemplate = (cheersGiven, cheersReceived, appHomeBlocks) => {
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
      createMyStatsSection(cheersGiven, cheersReceived),
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
