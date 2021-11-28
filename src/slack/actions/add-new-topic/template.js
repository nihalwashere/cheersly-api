const {
  BLOCK_IDS: { NEW_INTEREST },
  ACTION_IDS: { NEW_INTEREST_VALUE }
} = require("../../../global/constants");

const createAddNewTopicView = (callback_id) => ({
  type: "modal",
  callback_id,
  title: {
    type: "plain_text",
    text: "Add new interest",
    emoji: true
  },
  submit: {
    type: "plain_text",
    text: "Save",
    emoji: true
  },
  close: {
    type: "plain_text",
    text: "Cancel",
    emoji: true
  },
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Add your interest by typing it below, once submitted, others can select it as their interest too!"
      }
    },
    {
      type: "input",
      block_id: NEW_INTEREST,
      element: {
        type: "plain_text_input",
        action_id: NEW_INTEREST_VALUE,
        placeholder: {
          type: "plain_text",
          text: "Type your new interest here..."
        },
        max_length: 20
      },
      label: {
        type: "plain_text",
        text: "New interest",
        emoji: true
      }
    },
    {
      type: "context",
      elements: [
        {
          type: "plain_text",
          text: "Tip: Make it concise and not too long.",
          emoji: true
        }
      ]
    }
  ]
});

module.exports = { createAddNewTopicView };
