const {
  BLOCK_IDS: {
    TWO_TRUTHS_CHANNEL,
    TWO_TRUTHS_TRUTH_ONE,
    TWO_TRUTHS_TRUTH_TWO,
    TWO_TRUTHS_LIE,
  },
  ACTION_IDS: {
    TWO_TRUTHS_CHANNEL_VALUE,
    TWO_TRUTHS_TRUTH_ONE_VALUE,
    TWO_TRUTHS_TRUTH_TWO_VALUE,
    TWO_TRUTHS_LIE_VALUE,
  },
} = require("../../../global/constants");

const createTwoTruthsAndALieView = callback_id => ({
  type: "modal",
  callback_id,
  title: {
    type: "plain_text",
    text: "Two truths and a lie",
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
      block_id: TWO_TRUTHS_CHANNEL,
      label: {
        type: "plain_text",
        text: "Which channel would you like to play in?",
        emoji: true,
      },
      element: {
        action_id: TWO_TRUTHS_CHANNEL_VALUE,
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
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Please fill in the truth and lie statements.*",
      },
    },
    {
      type: "input",
      block_id: TWO_TRUTHS_TRUTH_ONE,
      element: {
        type: "plain_text_input",
        action_id: TWO_TRUTHS_TRUTH_ONE_VALUE,
        placeholder: {
          type: "plain_text",
          text: "Enter first truth statement",
          emoji: true,
        },
      },
      label: {
        type: "plain_text",
        text: "Truth 1",
        emoji: true,
      },
    },
    {
      type: "input",
      block_id: TWO_TRUTHS_TRUTH_TWO,
      element: {
        type: "plain_text_input",
        action_id: TWO_TRUTHS_TRUTH_TWO_VALUE,
        placeholder: {
          type: "plain_text",
          text: "Enter second truth statement",
          emoji: true,
        },
      },
      label: {
        type: "plain_text",
        text: "Truth 2",
        emoji: true,
      },
    },
    {
      type: "input",
      block_id: TWO_TRUTHS_LIE,
      element: {
        type: "plain_text_input",
        action_id: TWO_TRUTHS_LIE_VALUE,
        placeholder: {
          type: "plain_text",
          text: "Enter lie statement",
          emoji: true,
        },
      },
      label: {
        type: "plain_text",
        text: "Lie",
        emoji: true,
      },
    },
  ],
});

module.exports = { createTwoTruthsAndALieView };
