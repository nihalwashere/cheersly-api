const {
  BLOCK_IDS: {
    POLL_QUESTION,
    SELECT_POLL_CHANNEL,
    SELECT_DURATION,
    POLL_OPTION_A,
    POLL_OPTION_B,
    POLL_OPTION_C,
    POLL_OPTION_D,
    SUBMIT_CHEERS_FOR_REASON,
    SUBMIT_CHEERS_TO_CHANNEL,
    SUBMIT_CHEERS_TO_USERS
  },
  ACTION_IDS: {
    POLL_QUESTION_VALUE,
    SELECTED_POLL_CHANNEL,
    SELECTED_DURATION,
    POLL_OPTION_A_VALUE,
    POLL_OPTION_B_VALUE,
    POLL_OPTION_C_VALUE,
    POLL_OPTION_D_VALUE,
    SUBMIT_CHEERS_FOR_REASON_VALUE,
    SUBMIT_CHEERS_TO_CHANNEL_VALUE,
    SUBMIT_CHEERS_TO_USERS_VALUE
  }
} = require("../global/constants");

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
        type: "section",
        block_id: SELECT_POLL_CHANNEL,
        text: {
          type: "mrkdwn",
          text: "*Select Poll Channel*"
        },
        accessory: {
          type: "channels_select",
          placeholder: {
            type: "plain_text",
            text: "Channel",
            emoji: true
          },
          action_id: SELECTED_POLL_CHANNEL
        }
      },
      {
        type: "section",
        block_id: SELECT_DURATION,
        text: {
          type: "mrkdwn",
          text: "*Select Poll Duration*"
        },
        accessory: {
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Duration",
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
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "_Note: Please make sure that Cheersly is invited to the channel you selected._"
        }
      }
    ]
  };
};

const submitCheersTemplate = (user_name, callback_id) => {
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
        element: {
          type: "multi_users_select",
          placeholder: {
            type: "plain_text",
            text: "Select your peers",
            emoji: true
          },
          action_id: SUBMIT_CHEERS_TO_USERS_VALUE
        },
        label: {
          type: "plain_text",
          text: "Whom do you want to say cheers to?",
          emoji: true
        }
      },
      {
        type: "input",
        block_id: SUBMIT_CHEERS_TO_CHANNEL,
        element: {
          type: "conversations_select",
          placeholder: {
            type: "plain_text",
            text: "Select conversation",
            emoji: true
          },
          filter: {
            include: ["public"]
          },
          action_id: SUBMIT_CHEERS_TO_CHANNEL_VALUE
        },
        label: {
          type: "plain_text",
          text: "Which channel do you want to post to?",
          emoji: true
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
      }
    ]
  };
};

const createInternalFeedbackTemplate = (
  name,
  email,
  regarding,
  description
) => {
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
        text: "*Email :* " + email
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

module.exports = {
  createAPITokensRevokedTemplate,
  createAppUninstalledTemplate,
  createAppInstalledTemplate,
  createSubmitAPollTemplate,
  submitCheersTemplate,
  createInternalFeedbackTemplate
};
