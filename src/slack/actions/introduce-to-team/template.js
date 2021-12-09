const {
  BLOCK_IDS: { INTRODUCE_TO_TEAM_CHANNEL, INTRODUCE_TO_TEAM_MESSAGE },
  ACTION_IDS: {
    INTRODUCE_TO_TEAM_CHANNEL_VALUE,
    INTRODUCE_TO_TEAM_MESSAGE_VALUE,
  },
} = require("../../../global/constants");

const createIntroduceToTeamView = callback_id => ({
  type: "modal",
  callback_id,
  title: {
    type: "plain_text",
    text: "Cheersly",
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
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Introduce Cheersly to the team and let the fun begin!",
      },
    },
    {
      type: "input",
      block_id: INTRODUCE_TO_TEAM_CHANNEL,
      label: {
        type: "plain_text",
        text: "Which channel would you like to post to?",
        emoji: true,
      },
      element: {
        action_id: INTRODUCE_TO_TEAM_CHANNEL_VALUE,
        type: "conversations_select",
        placeholder: {
          type: "plain_text",
          text: "Select channel",
          emoji: true,
        },
        filter: {
          include: ["public"],
          exclude_bot_users: true,
          exclude_external_shared_channels: true,
        },
      },
    },
    {
      type: "input",
      block_id: INTRODUCE_TO_TEAM_MESSAGE,
      element: {
        type: "plain_text_input",
        multiline: true,
        action_id: INTRODUCE_TO_TEAM_MESSAGE_VALUE,
        initial_value:
          "Hi team!\n\nWe have started using Cheersly to add some fun and camaraderie to our workspace. Head over to the home tab of Cheersly and let the fun being!",
      },
      label: {
        type: "plain_text",
        text: "Message",
        emoji: true,
      },
    },
  ],
});

module.exports = { createIntroduceToTeamView };
