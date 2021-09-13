const {
  SLACK_ACTIONS: { CUSTOMER_FEEDBACK }
} = require("../../../global/constants");

const createHelpTemplate = (url) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: ":wave: *Hey there!* How may I help you?"
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "List of available commands :"
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*/cheers* \n To cheer your peers"
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*/cheers poll* \n Ask a question to your peers and get a poll (anonymous/non-anonymous)"
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*/cheers feedback* \n Share feedback with your team (anonymous/non-anonymous)"
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*/cheers onboard* \n Get onboarding instructions"
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*/cheers help* \n Seek some help"
      }
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "Got a question? Check our <https://cheersly.club/faq|FAQ's>"
        }
      ]
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Take me to app dashboard!*"
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "App Dashboard",
          emoji: true
        },
        url,
        value: "take_me_to_app_dashboard"
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "_Get a sneak peak of your team's mood in the home tab of *Cheersly*_"
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*Question or Feedback?* \n Let us know if you have any questions or feedback"
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
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "Need help? contact support@cheersly.club"
        }
      ]
    }
  ];
};

module.exports = { createHelpTemplate };
