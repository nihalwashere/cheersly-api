const {
  BLOCK_IDS: { SELECT_OPTION_FOR_FEEDBACK, FEEDBACK_DESCRIPTION },
  ACTION_IDS: { SELECTED_OPTION_FOR_FEEDBACK, FEEDBACK_DESCRIPTION_TEXT },
  VIEW_SUBMISSIONS: { CUSTOMER_FEEDBACK },
  FEEDBACK_OPTIONS: {
    HELP_WITH_GETTING_STARTED,
    REQUEST_A_FEATURE,
    RAISE_A_BUG,
    FEEDBACK,
    SOMETHING_ELSE
  }
} = require("../../../global/constants");

const createShareFeedbackTemplate = () => {
  return {
    type: "modal",
    callback_id: CUSTOMER_FEEDBACK,
    title: {
      type: "plain_text",
      text: "We are all ears!",
      emoji: true
    },
    submit: {
      type: "plain_text",
      text: "Send",
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
        block_id: SELECT_OPTION_FOR_FEEDBACK,
        element: {
          type: "static_select",
          action_id: SELECTED_OPTION_FOR_FEEDBACK,
          placeholder: {
            type: "plain_text",
            text: "Choose an option...",
            emoji: true
          },
          options: [
            {
              text: {
                type: "plain_text",
                text: ":rocket: Help with getting started",
                emoji: true
              },
              value: HELP_WITH_GETTING_STARTED
            },
            {
              text: {
                type: "plain_text",
                text: ":pray: Request a feature",
                emoji: true
              },
              value: REQUEST_A_FEATURE
            },
            {
              text: {
                type: "plain_text",
                text: ":beetle: Raise a bug",
                emoji: true
              },
              value: RAISE_A_BUG
            },
            {
              text: {
                type: "plain_text",
                text: ":raised_hand: Give constructive feedback",
                emoji: true
              },
              value: FEEDBACK
            },
            {
              text: {
                type: "plain_text",
                text: ":jack_o_lantern: Something else",
                emoji: true
              },
              value: SOMETHING_ELSE
            }
          ]
        },
        label: {
          type: "plain_text",
          text: "Regarding...",
          emoji: true
        }
      },
      {
        type: "input",
        block_id: FEEDBACK_DESCRIPTION,
        optional: true,
        element: {
          type: "plain_text_input",
          action_id: FEEDBACK_DESCRIPTION_TEXT,
          multiline: true
        },
        label: {
          type: "plain_text",
          text: "Your thoughts :",
          emoji: true
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "plain_text",
            text: "Some details would really help :smiley:",
            emoji: true
          }
        ]
      }
    ]
  };
};

module.exports = { createShareFeedbackTemplate };
