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
    SUBMIT_CHEERS_TO_CHANNEL,
    SUBMIT_CHEERS_FOR_COMPANY_VALUES,
    SUBMIT_CHEERS_TO_USERS,
    SHOULD_SHARE_GIPHY,
    FEEDBACK_DESCRIPTION,
    FEEDBACK_CHANNEL,
    FEEDBACK_IS_ANONYMOUS
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
    SUBMIT_CHEERS_TO_CHANNEL_VALUE,
    SUBMIT_CHEERS_FOR_COMPANY_VALUES_VALUE,
    SUBMIT_CHEERS_TO_USERS_VALUE,
    SHOULD_SHARE_GIPHY_VALUE,
    FEEDBACK_DESCRIPTION_VALUE,
    FEEDBACK_CHANNEL_VALUE,
    FEEDBACK_IS_ANONYMOUS_VALUE
  },
  SLACK_ACTIONS: { CUSTOMER_FEEDBACK }
} = require("../global/constants");
const { getAppHomeLink } = require("../utils/common");

const createAPITokensRevokedTemplate = (teamId) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "API tokens revoked by team - " + teamId
      }
    }
  ];
};

const createAppUninstalledTemplate = (teamId) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Slack app uninstalled by team - " + teamId
      }
    }
  ];
};

const createAppInstalledTemplate = (teamId) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "App installed by team - " + teamId
      }
    }
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
      emoji: true
    },
    submit: {
      type: "plain_text",
      text: "Submit",
      emoji: true
    },
    close: {
      type: "plain_text",
      text: "Cancel",
      emoji: true
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
            emoji: true
          }
        },
        label: {
          type: "plain_text",
          text: "Poll Question",
          emoji: true
        }
      },
      {
        type: "input",
        block_id: SELECT_POLL_CHANNEL,
        label: {
          type: "plain_text",
          text: "Poll Channel",
          emoji: true
        },
        element: {
          action_id: SELECTED_POLL_CHANNEL,
          type: "conversations_select",
          placeholder: {
            type: "plain_text",
            text: "Select channel",
            emoji: true
          },
          filter: {
            include: ["private", "public"],
            exclude_bot_users: true,
            exclude_external_shared_channels: true
          }
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "plain_text",
            text: "Note: Please make sure that Cheersly is invited to the channel you selected.",
            emoji: true
          }
        ]
      },
      {
        type: "input",
        block_id: SELECT_DURATION,
        label: {
          type: "plain_text",
          text: "Poll Duration",
          emoji: true
        },
        element: {
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Select duration",
            emoji: true
          },
          options: [
            {
              text: {
                type: "plain_text",
                text: "15 mins",
                emoji: true
              },
              value: "15"
            },
            {
              text: {
                type: "plain_text",
                text: "30 mins",
                emoji: true
              },
              value: "30"
            },
            {
              text: {
                type: "plain_text",
                text: "1 hour",
                emoji: true
              },
              value: "60"
            },
            {
              text: {
                type: "plain_text",
                text: "2 hours",
                emoji: true
              },
              value: "120"
            },
            {
              text: {
                type: "plain_text",
                text: "4 hours",
                emoji: true
              },
              value: "240"
            },
            {
              text: {
                type: "plain_text",
                text: "8 hours",
                emoji: true
              },
              value: "480"
            },
            {
              text: {
                type: "plain_text",
                text: "12 hours",
                emoji: true
              },
              value: "720"
            },
            {
              text: {
                type: "plain_text",
                text: "1 day",
                emoji: true
              },
              value: "1440"
            },
            {
              text: {
                type: "plain_text",
                text: "2 days",
                emoji: true
              },
              value: "2880"
            },
            {
              text: {
                type: "plain_text",
                text: "3 days",
                emoji: true
              },
              value: "4320"
            },
            {
              text: {
                type: "plain_text",
                text: "1 week",
                emoji: true
              },
              value: "10080"
            }
          ],
          action_id: SELECTED_DURATION
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Is Poll Anonymous?*"
        },
        block_id: POLL_IS_ANONYMOUS,
        accessory: {
          type: "checkboxes",
          options: [
            {
              text: {
                type: "mrkdwn",
                text: "Hide my identity"
              }
            }
          ],
          action_id: POLL_IS_ANONYMOUS_VALUE
        }
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
            emoji: true
          }
        },
        label: {
          type: "plain_text",
          text: "Option A",
          emoji: true
        }
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
            emoji: true
          }
        },
        label: {
          type: "plain_text",
          text: "Option B",
          emoji: true
        }
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
            emoji: true
          }
        },
        label: {
          type: "plain_text",
          text: "Option C",
          emoji: true
        }
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
            emoji: true
          }
        },
        label: {
          type: "plain_text",
          text: "Option D",
          emoji: true
        }
      }
    ]
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
      emoji: true
    },
    submit: {
      type: "plain_text",
      text: "Submit",
      emoji: true
    },
    close: {
      type: "plain_text",
      text: "Cancel",
      emoji: true
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
            emoji: true
          }
        },
        label: {
          type: "plain_text",
          text: "Feedback",
          emoji: true
        }
      },
      {
        type: "input",
        block_id: FEEDBACK_CHANNEL,
        label: {
          type: "plain_text",
          text: "Feedback Channel",
          emoji: true
        },
        element: {
          action_id: FEEDBACK_CHANNEL_VALUE,
          type: "conversations_select",
          placeholder: {
            type: "plain_text",
            text: "Select channel",
            emoji: true
          },
          filter: {
            include: ["private", "public"],
            exclude_bot_users: true,
            exclude_external_shared_channels: true
          }
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "plain_text",
            text: "Note: Please make sure that Cheersly is invited to the channel you selected.",
            emoji: true
          }
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Is Feedback Anonymous?*"
        },
        block_id: FEEDBACK_IS_ANONYMOUS,
        accessory: {
          type: "checkboxes",
          options: [
            {
              text: {
                type: "mrkdwn",
                text: "Hide my identity"
              }
            }
          ],
          action_id: FEEDBACK_IS_ANONYMOUS_VALUE
        }
      }
    ]
  };
};

const submitCheersTemplate = (user_name, callback_id, companyValueOptions) => {
  return {
    type: "modal",
    callback_id,
    private_metadata: user_name,
    title: {
      type: "plain_text",
      text: "Say Cheers",
      emoji: true
    },
    submit: {
      type: "plain_text",
      text: "Submit",
      emoji: true
    },
    close: {
      type: "plain_text",
      text: "Cancel",
      emoji: true
    },
    blocks: [
      {
        type: "input",
        block_id: SUBMIT_CHEERS_TO_USERS,
        label: {
          type: "plain_text",
          text: "Whom do you want to say cheers to?",
          emoji: true
        },
        element: {
          action_id: SUBMIT_CHEERS_TO_USERS_VALUE,
          type: "multi_conversations_select",
          placeholder: {
            type: "plain_text",
            text: "Select your peers",
            emoji: true
          },
          filter: {
            include: ["im"],
            exclude_bot_users: true,
            exclude_external_shared_channels: true
          }
        }
      },
      {
        type: "input",
        block_id: SUBMIT_CHEERS_TO_CHANNEL,
        label: {
          type: "plain_text",
          text: "Which channel do you want to post to?",
          emoji: true
        },
        element: {
          action_id: SUBMIT_CHEERS_TO_CHANNEL_VALUE,
          type: "conversations_select",
          placeholder: {
            type: "plain_text",
            text: "Select channel",
            emoji: true
          },
          filter: {
            include: ["private", "public"],
            exclude_bot_users: true,
            exclude_external_shared_channels: true
          }
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "plain_text",
            text: "Note: Please make sure that Cheersly is invited to the channel you selected.",
            emoji: true
          }
        ]
      },
      {
        type: "input",
        block_id: SUBMIT_CHEERS_FOR_COMPANY_VALUES,
        optional: true,
        label: {
          type: "plain_text",
          text: "Tag company values",
          emoji: true
        },
        element: {
          type: "multi_static_select",
          placeholder: {
            type: "plain_text",
            text: "Select a company value",
            emoji: true
          },
          options: companyValueOptions,
          action_id: SUBMIT_CHEERS_FOR_COMPANY_VALUES_VALUE
        }
      },
      {
        type: "input",
        block_id: SUBMIT_CHEERS_FOR_REASON,
        optional: true,
        element: {
          type: "plain_text_input",
          multiline: true,
          action_id: SUBMIT_CHEERS_FOR_REASON_VALUE
        },
        label: {
          type: "plain_text",
          text: "For reason?",
          emoji: true
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Would you like to post a Giphy?*"
        },
        block_id: SHOULD_SHARE_GIPHY,
        accessory: {
          type: "checkboxes",
          options: [
            {
              text: {
                type: "mrkdwn",
                text: "Share cheers Giphy"
              }
            }
          ],
          action_id: SHOULD_SHARE_GIPHY_VALUE
        }
      }
    ]
  };
};

const createInternalFeedbackTemplate = (name, regarding, description) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Received a new feedback"
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Name :* " + name
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Regarding :* " + regarding
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Description :* " + description
      }
    }
  ];
};

const createSupportContextTemplate = () => ({
  type: "context",
  elements: [
    {
      type: "mrkdwn",
      text: "Need help? contact support@cheersly.club or check our <https://cheersly.club/faq|FAQ's>"
    }
  ]
});

const createHomeSneakPeakTemplate = (teamId) => ({
  type: "section",
  text: {
    type: "mrkdwn",
    text: `_Get a sneak peak of your team's mood in the ${getAppHomeLink(
      teamId
    )} tab of *Cheersly*_`
  }
});

const createAdminOnboardingMessageTemplate = (appUrl, teamId) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Hey there :wave: Hope you are doing good! I am *Cheersly*, you recently installed me to your workspace, remember?"
    }
  },
  {
    type: "context",
    elements: [
      {
        type: "plain_text",
        text: "Note: You are seeing this message because either you installed the app to this workspace or you are an admin.",
        emoji: true
      }
    ]
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Wanted to check in if you have setup *Cheersly* for your team yet? If you haven't, let me guide you through!"
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `1) Deliver a fun, candid and social *Recognition & Rewards* experience for your employees. You can add, edit or delete rewards from the <${appUrl}|app dashboard>. Create real-life perks and reward your team.`
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `2) Recognize when employees align with your company values to reinforce good behavior. You can add, edit or delete company values from the <${appUrl}|app dashboard>.`
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "3) Constantly share cheers with your peer team members using the command `/cheers`. Team building activities help to bridge gaps and build relationships."
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "4) Cheersly provides opportunities to share anonymous feedback. To share feedback use the command `/cheers feedback`."
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "5) Ask questions and receive insights that help you make a decision. Conduct polls using the command `/cheers poll`."
    }
  },
  createHomeSneakPeakTemplate(teamId),
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Please feel free to share any feedback, we are all ears and we would sincerely value your input!"
    },
    accessory: {
      type: "button",
      text: {
        type: "plain_text",
        text: "Share feedback",
        emoji: true
      },
      action_id: CUSTOMER_FEEDBACK
    }
  },
  createSupportContextTemplate()
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
  createAdminOnboardingMessageTemplate
};
