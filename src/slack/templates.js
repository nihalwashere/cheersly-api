const {
  BLOCK_IDS: {
    POLL_QUESTION,
    SELECT_POLL_CHANNEL,
    SELECT_DURATION,
    POLL_IS_ANONYMOUS,
    POLL_OPTION_A,
    POLL_OPTION_B,
    POLL_OPTION_C,
    POLL_OPTION_D,
    SUBMIT_CHEERS_FOR_REASON,
    SUBMIT_CHEERS_FOR_POINTS,
    SUBMIT_CHEERS_FOR_COMPANY_VALUES,
    SUBMIT_CHEERS_TO_USERS,
    SHOULD_SHARE_GIPHY,
    FEEDBACK_DESCRIPTION,
    FEEDBACK_CHANNEL,
    FEEDBACK_IS_ANONYMOUS,
  },
  ACTION_IDS: {
    POLL_QUESTION_VALUE,
    SELECTED_POLL_CHANNEL,
    SELECTED_DURATION,
    POLL_IS_ANONYMOUS_VALUE,
    POLL_OPTION_A_VALUE,
    POLL_OPTION_B_VALUE,
    POLL_OPTION_C_VALUE,
    POLL_OPTION_D_VALUE,
    SUBMIT_CHEERS_FOR_REASON_VALUE,
    SUBMIT_CHEERS_FOR_POINTS_VALUE,
    SUBMIT_CHEERS_FOR_COMPANY_VALUES_VALUE,
    SUBMIT_CHEERS_TO_USERS_VALUE,
    SHOULD_SHARE_GIPHY_VALUE,
    FEEDBACK_DESCRIPTION_VALUE,
    FEEDBACK_CHANNEL_VALUE,
    FEEDBACK_IS_ANONYMOUS_VALUE,
  },
} = require("../global/constants");
const { getAppHomeUrl, getAppHomeLink } = require("../utils/common");

const createAPITokensRevokedTemplate = teamId => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "API tokens revoked by team - " + teamId,
      },
    },
  ];
};

const createAppUninstalledTemplate = teamId => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Slack app uninstalled by team - " + teamId,
      },
    },
  ];
};

const createAppInstalledTemplate = teamId => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "App installed by team - " + teamId,
      },
    },
  ];
};

const createSubmitAPollTemplate = (user_name, callback_id) => {
  return {
    type: "modal",
    callback_id,
    private_metadata: user_name,
    title: {
      type: "plain_text",
      text: "Submit a Poll",
      emoji: true,
    },
    submit: {
      type: "plain_text",
      text: "Submit",
      emoji: true,
    },
    close: {
      type: "plain_text",
      text: "Cancel",
      emoji: true,
    },
    blocks: [
      {
        type: "input",
        block_id: POLL_QUESTION,
        element: {
          type: "plain_text_input",
          multiline: true,
          action_id: POLL_QUESTION_VALUE,
          placeholder: {
            type: "plain_text",
            text: "Ask something!",
            emoji: true,
          },
        },
        label: {
          type: "plain_text",
          text: "Poll Question",
          emoji: true,
        },
      },
      {
        type: "input",
        block_id: SELECT_POLL_CHANNEL,
        label: {
          type: "plain_text",
          text: "Poll Channel",
          emoji: true,
        },
        element: {
          action_id: SELECTED_POLL_CHANNEL,
          type: "conversations_select",
          placeholder: {
            type: "plain_text",
            text: "Select channel",
            emoji: true,
          },
          filter: {
            include: ["private", "public"],
            exclude_bot_users: true,
            exclude_external_shared_channels: true,
          },
        },
      },
      {
        type: "input",
        block_id: SELECT_DURATION,
        label: {
          type: "plain_text",
          text: "Poll Duration",
          emoji: true,
        },
        element: {
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Select duration",
            emoji: true,
          },
          options: [
            {
              text: {
                type: "plain_text",
                text: "15 mins",
                emoji: true,
              },
              value: "15",
            },
            {
              text: {
                type: "plain_text",
                text: "30 mins",
                emoji: true,
              },
              value: "30",
            },
            {
              text: {
                type: "plain_text",
                text: "1 hour",
                emoji: true,
              },
              value: "60",
            },
            {
              text: {
                type: "plain_text",
                text: "2 hours",
                emoji: true,
              },
              value: "120",
            },
            {
              text: {
                type: "plain_text",
                text: "4 hours",
                emoji: true,
              },
              value: "240",
            },
            {
              text: {
                type: "plain_text",
                text: "8 hours",
                emoji: true,
              },
              value: "480",
            },
            {
              text: {
                type: "plain_text",
                text: "12 hours",
                emoji: true,
              },
              value: "720",
            },
            {
              text: {
                type: "plain_text",
                text: "1 day",
                emoji: true,
              },
              value: "1440",
            },
            {
              text: {
                type: "plain_text",
                text: "2 days",
                emoji: true,
              },
              value: "2880",
            },
            {
              text: {
                type: "plain_text",
                text: "3 days",
                emoji: true,
              },
              value: "4320",
            },
            {
              text: {
                type: "plain_text",
                text: "1 week",
                emoji: true,
              },
              value: "10080",
            },
          ],
          action_id: SELECTED_DURATION,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Is Poll Anonymous?*",
        },
        block_id: POLL_IS_ANONYMOUS,
        accessory: {
          type: "checkboxes",
          options: [
            {
              text: {
                type: "mrkdwn",
                text: "Hide my identity",
              },
            },
          ],
          action_id: POLL_IS_ANONYMOUS_VALUE,
        },
      },
      {
        type: "input",
        block_id: POLL_OPTION_A,
        element: {
          type: "plain_text_input",
          action_id: POLL_OPTION_A_VALUE,
          placeholder: {
            type: "plain_text",
            text: "Option A",
            emoji: true,
          },
        },
        label: {
          type: "plain_text",
          text: "Option A",
          emoji: true,
        },
      },
      {
        type: "input",
        block_id: POLL_OPTION_B,
        element: {
          type: "plain_text_input",
          action_id: POLL_OPTION_B_VALUE,
          placeholder: {
            type: "plain_text",
            text: "Option B",
            emoji: true,
          },
        },
        label: {
          type: "plain_text",
          text: "Option B",
          emoji: true,
        },
      },
      {
        type: "input",
        block_id: POLL_OPTION_C,
        optional: true,
        element: {
          type: "plain_text_input",
          action_id: POLL_OPTION_C_VALUE,
          placeholder: {
            type: "plain_text",
            text: "Option C",
            emoji: true,
          },
        },
        label: {
          type: "plain_text",
          text: "Option C",
          emoji: true,
        },
      },
      {
        type: "input",
        block_id: POLL_OPTION_D,
        optional: true,
        element: {
          type: "plain_text_input",
          action_id: POLL_OPTION_D_VALUE,
          placeholder: {
            type: "plain_text",
            text: "Option D",
            emoji: true,
          },
        },
        label: {
          type: "plain_text",
          text: "Option D",
          emoji: true,
        },
      },
    ],
  };
};

const createSubmitAFeedbackTemplate = (user_name, callback_id) => {
  return {
    type: "modal",
    callback_id,
    private_metadata: user_name,
    title: {
      type: "plain_text",
      text: "Submit a Feedback",
      emoji: true,
    },
    submit: {
      type: "plain_text",
      text: "Submit",
      emoji: true,
    },
    close: {
      type: "plain_text",
      text: "Cancel",
      emoji: true,
    },
    blocks: [
      {
        type: "input",
        block_id: FEEDBACK_DESCRIPTION,
        element: {
          type: "plain_text_input",
          multiline: true,
          action_id: FEEDBACK_DESCRIPTION_VALUE,
          placeholder: {
            type: "plain_text",
            text: "Share constructive feedback!",
            emoji: true,
          },
        },
        label: {
          type: "plain_text",
          text: "Feedback",
          emoji: true,
        },
      },
      {
        type: "input",
        block_id: FEEDBACK_CHANNEL,
        label: {
          type: "plain_text",
          text: "Feedback Channel",
          emoji: true,
        },
        element: {
          action_id: FEEDBACK_CHANNEL_VALUE,
          type: "conversations_select",
          placeholder: {
            type: "plain_text",
            text: "Select channel",
            emoji: true,
          },
          filter: {
            include: ["private", "public"],
            exclude_bot_users: true,
            exclude_external_shared_channels: true,
          },
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Is Feedback Anonymous?*",
        },
        block_id: FEEDBACK_IS_ANONYMOUS,
        accessory: {
          type: "checkboxes",
          options: [
            {
              text: {
                type: "mrkdwn",
                text: "Hide my identity",
              },
            },
          ],
          action_id: FEEDBACK_IS_ANONYMOUS_VALUE,
        },
      },
    ],
  };
};

const submitCheersTemplate = ({
  metaData,
  callback_id,
  companyValueOptions,
  pointAmountOptions,
  remainingPointsForUser,
  teamSettings,
}) => {
  const blocks = [
    {
      type: "input",
      block_id: SUBMIT_CHEERS_TO_USERS,
      label: {
        type: "plain_text",
        text: "Whom do you want to say cheers to?",
        emoji: true,
      },
      element: {
        action_id: SUBMIT_CHEERS_TO_USERS_VALUE,
        type: "multi_conversations_select",
        placeholder: {
          type: "plain_text",
          text: "Select your peers",
          emoji: true,
        },
        filter: {
          include: ["im"],
          exclude_bot_users: true,
          exclude_external_shared_channels: true,
        },
      },
    },
    {
      type: "input",
      block_id: SUBMIT_CHEERS_FOR_POINTS,
      label: {
        type: "plain_text",
        text: "How many points would you like to share with each recipient?",
        emoji: true,
      },
      element: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: "Select a point amount",
          emoji: true,
        },
        options: pointAmountOptions.map(elem => ({
          text: {
            type: "plain_text",
            text: `${elem} points`,
            emoji: true,
          },
          value: elem,
        })),
        action_id: SUBMIT_CHEERS_FOR_POINTS_VALUE,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "plain_text",
          text: `You currently have ${remainingPointsForUser} points remaining.`,
          emoji: true,
        },
      ],
    },
    {
      type: "input",
      block_id: SUBMIT_CHEERS_FOR_REASON,
      element: {
        type: "plain_text_input",
        multiline: true,
        action_id: SUBMIT_CHEERS_FOR_REASON_VALUE,
      },
      label: {
        type: "plain_text",
        text: "For reason?",
        emoji: true,
      },
    },
  ];

  if (companyValueOptions.length) {
    blocks.push({
      type: "input",
      block_id: SUBMIT_CHEERS_FOR_COMPANY_VALUES,
      optional: !teamSettings.requireCompanyValues,
      label: {
        type: "plain_text",
        text: "Tag company values",
        emoji: true,
      },
      element: {
        type: "multi_static_select",
        placeholder: {
          type: "plain_text",
          text: "Select a company value",
          emoji: true,
        },
        options: companyValueOptions,
        action_id: SUBMIT_CHEERS_FOR_COMPANY_VALUES_VALUE,
      },
    });
  }

  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*Would you like to post a Giphy?*",
    },
    block_id: SHOULD_SHARE_GIPHY,
    accessory: {
      type: "checkboxes",
      options: [
        {
          text: {
            type: "mrkdwn",
            text: "Share cheers Giphy",
          },
        },
      ],
      action_id: SHOULD_SHARE_GIPHY_VALUE,
    },
  });

  return {
    type: "modal",
    callback_id,
    private_metadata: metaData,
    title: {
      type: "plain_text",
      text: "Say Cheers",
      emoji: true,
    },
    submit: {
      type: "plain_text",
      text: "Say Cheers :beers:",
      emoji: true,
    },
    close: {
      type: "plain_text",
      text: "Cancel",
      emoji: true,
    },
    blocks,
  };
};

const createInternalFeedbackTemplate = (name, regarding, description) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Received a new feedback",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Name :* " + name,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Regarding :* " + regarding,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Description :* " + description,
      },
    },
  ];
};

const createSupportContextTemplate = () => ({
  type: "context",
  elements: [
    {
      type: "mrkdwn",
      text:
        "Need help? contact support@cheersly.club or check our <https://cheersly.club/faq|FAQ's>",
    },
  ],
});

const createHomeSneakPeakTemplate = teamId => ({
  type: "section",
  text: {
    type: "mrkdwn",
    text: `_Take me to ${getAppHomeLink(teamId)} tab of *Cheersly*_`,
  },
});

const createNotInChannelTemplate = () => ({
  type: "modal",
  title: {
    type: "plain_text",
    text: "Cheersly",
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
          "Oops, Cheersly is not in that private channel. Invite Cheersly to this private channel and try again!",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "To invite Cheersly to a channel, enter `/invite @Cheersly` in that channel.",
      },
    },
  ],
});

const createGamePostedSuccessModalTemplate = ({
  teamId,
  channelId,
  message,
}) => ({
  type: "modal",
  title: {
    type: "plain_text",
    text: "Cheersly",
    emoji: true,
  },
  close: {
    type: "plain_text",
    text: "Done",
    emoji: true,
  },
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: message,
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: ":beach_with_umbrella: Take me there",
            emoji: true,
          },
          url: `slack://channel?team=${teamId}&id=${channelId}`,
        },
      ],
    },
  ],
});

const createOnboardingTemplate = teamId => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        "Hey there :wave: I'm Cheersly, the employee engagement and peer recognition app for Slack.",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        "I am here to help your team recognize each other for all of the meaningful contributions that you make.",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*Here's how it works:*",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Use the command `/cheers` to share cheers with your peers.",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        ":thumbsup: *Show some support*\nAdd any reaction to cheers that are posted publicly as a fun way to show your support to your peers.",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        ":moneybag: *Earn & redeem points*\nAccrue points from cheers to redeem in our reward catalog.",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        ":ice_cube: *Fun Icebreakers*\nSpark funny conversations with your peers.",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        ":v: *Play 1-1 Games*\nPlay Tic Tac Toe or Stone Paper Scissors with your co-worker.",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Head over to the home tab of Cheersly and let the fun begin!",
    },
    accessory: {
      type: "button",
      text: {
        type: "plain_text",
        text: "Take me there :rocket:",
        emoji: true,
      },
      url: getAppHomeUrl(teamId),
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Cheers :beers:",
    },
  },
  createSupportContextTemplate(),
];

module.exports = {
  createAPITokensRevokedTemplate,
  createAppUninstalledTemplate,
  createAppInstalledTemplate,
  createSubmitAPollTemplate,
  submitCheersTemplate,
  createInternalFeedbackTemplate,
  createSubmitAFeedbackTemplate,
  createSupportContextTemplate,
  createHomeSneakPeakTemplate,
  createNotInChannelTemplate,
  createGamePostedSuccessModalTemplate,
  createOnboardingTemplate,
};
