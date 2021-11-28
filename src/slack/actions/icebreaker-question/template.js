const {
  BLOCK_IDS: { ICEBREAKER_QUESTION_CHANNEL },
  ACTION_IDS: { ICEBREAKER_QUESTION_CHANNEL_VALUE },
} = require("../../../global/constants");

const createIcebreakerQuestionView = callback_id => ({
  type: "modal",
  callback_id,
  title: {
    type: "plain_text",
    text: "Icebreaker Question",
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
      block_id: ICEBREAKER_QUESTION_CHANNEL,
      label: {
        type: "plain_text",
        text: "Which channel would you like to play in?",
        emoji: true,
      },
      element: {
        action_id: ICEBREAKER_QUESTION_CHANNEL_VALUE,
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

module.exports = { createIcebreakerQuestionView };
