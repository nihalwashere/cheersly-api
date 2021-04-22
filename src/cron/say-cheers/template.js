const {
  SLACK_ACTIONS: { SAY_CHEERS }
} = require("../../global/constants");

const createSayCheersTemplate = () => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "Hey there :wave: \n\n It's a great day to say cheers to your peers!"
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "Say Cheers!",
          emoji: true
        },
        action_id: SAY_CHEERS
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "What are you waiting for? *Push your team forward!*"
      }
    }
  ];
};

module.exports = { createSayCheersTemplate };
