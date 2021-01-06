const {
  BLOCK_IDS: { POLL_QUESTION, SELECT_POLL_CHANNEL, SELECT_DURATION },
  ACTION_IDS: { POLL_QUESTION_VALUE, SELECTED_POLL_CHANNEL, SELECTED_DURATION }
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

const createSubmitAPollTemplate = (channelId, callback_id) => {
  return {
    type: "modal",
    callback_id,
    private_metadata: channelId,
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
          action_id: POLL_QUESTION_VALUE
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
          text: "*Poll Duration*"
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
              value: 15
            },
            {
              text: {
                type: "plain_text",
                text: "30 mins",
                emoji: true
              },
              value: 30
            },
            {
              text: {
                type: "plain_text",
                text: "1 hour",
                emoji: true
              },
              value: 60
            },
            {
              text: {
                type: "plain_text",
                text: "2 hours",
                emoji: true
              },
              value: 120
            },
            {
              text: {
                type: "plain_text",
                text: "4 hours",
                emoji: true
              },
              value: 240
            },
            {
              text: {
                type: "plain_text",
                text: "8 hours",
                emoji: true
              },
              value: 480
            },
            {
              text: {
                type: "plain_text",
                text: "12 hours",
                emoji: true
              },
              value: 720
            },
            {
              text: {
                type: "plain_text",
                text: "24 hours",
                emoji: true
              },
              value: 1440
            },
            {
              text: {
                type: "plain_text",
                text: "48 hours",
                emoji: true
              },
              value: 2880
            },
            {
              text: {
                type: "plain_text",
                text: "72 hours",
                emoji: true
              },
              value: 4320
            }
          ],
          action_id: SELECTED_DURATION
        }
      }
    ]
  };
};

module.exports = {
  createAPITokensRevokedTemplate,
  createAppUninstalledTemplate,
  createAppInstalledTemplate,
  createSubmitAPollTemplate
};
