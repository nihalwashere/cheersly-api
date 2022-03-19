const {
  SLACK_ACTIONS: {
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

const createAppHomeTemplate = ({
  slackUserId,
  appUrl,
  cheersGiven,
  cheersReceived,
  cheersRedeemable,
  totalPointAllowance,
  totalSpentThisMonth,
  totalPointsRemaining,
  isSubscriptionExpired,
  isTrialPlan,
}) => {
  let blocks = [];

  if (isSubscriptionExpired) {
    let text = "";

    if (isTrialPlan) {
      text = trialEndedText;
    } else {
      text = upgradeSubscriptionText;
    }

    blocks = [
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

  blocks = [
    ...blocks,
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Hey <@${slackUserId}> :wave:`,
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
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Your Cheers* :beers:",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Given: *${cheersGiven}*   |   Received: *${cheersReceived}*   |   Redeemable: *${cheersRedeemable}*`,
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: "*Point Allowance* :coin:",
        },
        {
          type: "mrkdwn",
          text: "*Points Spent* :moneybag:",
        },
      ],
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `Total \`${totalPointAllowance} points\` available this month`,
        },
        {
          type: "mrkdwn",
          text: `Total \`${totalSpentThisMonth} points\` spent this month`,
        },
      ],
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: "*Points Remaining* :money_mouth_face:",
        },
      ],
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `Total \`${totalPointsRemaining} points\` remaining this month`,
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
  ];

  return {
    type: "home",
    blocks,
  };
};

module.exports = {
  createAppHomeTemplate,
};
