const {
  SLACK_ACTIONS: {
    SAY_CHEERS,
    START_A_POLL,
    SHARE_FEEDBACK_WITH_TEAM,
    THIS_OR_THAT,
    ICEBREAKER_QUESTION,
    TWO_TRUTHS_AND_A_LIE,
    TIC_TAC_TOE_HELP,
    STONE_PAPER_SCISSORS_HELP,
  },
} = require("../../global/constants");
const { createSupportContextTemplate } = require("../templates");
const {
  trialEndedText,
  upgradeSubscriptionText,
} = require("../subscription-handlers/template");

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
  let leaderBoardString = "";

  for (let i = 0; i < 3; i++) {
    if (leaders[i]) {
      const { slackUsername, cheersReceived } = leaders[i];

      leaderBoardString +=
        "-  @" + slackUsername + "  (" + cheersReceived + ") \n";
    }
  }

  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: leaderBoardString,
    },
  };
};

const createAppHomeLeaderBoard = ({ leaders, leaderBoardUrl }) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Leaderboard* :trophy:",
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "View full leaderboard",
          emoji: true,
        },
        url: leaderBoardUrl,
      },
    },
    createAppHomeLeadersSection(leaders),
  ];
};

const createAppHomeTemplate = ({
  appUrl,
  cheersGiven,
  cheersReceived,
  cheersRedeemable,
  appHomeBlocks,
  isSubscriptionExpired,
  isTrialPlan,
}) => {
  const appHomeTemplate = {
    type: "home",
    blocks: [],
  };

  if (isSubscriptionExpired) {
    let text = "";

    if (isTrialPlan) {
      text = trialEndedText;
    } else {
      text = upgradeSubscriptionText;
    }

    appHomeTemplate.blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text,
        },
      },
      {
        type: "divider",
      },
    ];
  }

  appHomeTemplate.blocks.push(
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
        url: appUrl,
      },
    },
    createMyStatsSection(cheersGiven, cheersReceived, cheersRedeemable),
    {
      type: "divider",
    }
  );

  // for leaderboard
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
          text: ":people_hugging: *Culture*",
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":beers: Say cheers to your peers",
              emoji: true,
            },
            value: SAY_CHEERS,
            action_id: SAY_CHEERS,
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":bar_chart: Start a poll",
              emoji: true,
            },
            value: START_A_POLL,
            action_id: START_A_POLL,
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":speech_balloon: Share feedback with team",
              emoji: true,
            },
            value: SHARE_FEEDBACK_WITH_TEAM,
            action_id: SHARE_FEEDBACK_WITH_TEAM,
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
            value: THIS_OR_THAT,
            action_id: THIS_OR_THAT,
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":question: Icebreaker question",
              emoji: true,
            },
            value: ICEBREAKER_QUESTION,
            action_id: ICEBREAKER_QUESTION,
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":lying_face: Two truths and a lie",
              emoji: true,
            },
            value: TWO_TRUTHS_AND_A_LIE,
            action_id: TWO_TRUTHS_AND_A_LIE,
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
              text: ":punch: Stone Paper Scissors",
              emoji: true,
            },
            value: STONE_PAPER_SCISSORS_HELP,
            action_id: STONE_PAPER_SCISSORS_HELP,
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":x: Tic Tac Toe :o:",
              emoji: true,
            },
            value: TIC_TAC_TOE_HELP,
            action_id: TIC_TAC_TOE_HELP,
          },
        ],
      },
      createSupportContextTemplate(),
    ],
  ];

  return appHomeTemplate;
};

module.exports = {
  createAppHomeLeaderBoard,
  createAppHomeTemplate,
};
