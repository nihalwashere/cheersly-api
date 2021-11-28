const {
  BLOCK_IDS: { THIS_OR_THAT_CHANNEL },
  ACTION_IDS: { THIS_OR_THAT_CHANNEL_VALUE },
} = require("../../../global/constants");

const createThisOrThatView = callback_id => ({
  type: "modal",
  callback_id,
  title: {
    type: "plain_text",
    text: "This or That",
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
      block_id: THIS_OR_THAT_CHANNEL,
      label: {
        type: "plain_text",
        text: "Which channel would you like to play in?",
        emoji: true,
      },
      element: {
        action_id: THIS_OR_THAT_CHANNEL_VALUE,
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
  ],
});

module.exports = { createThisOrThatView };
