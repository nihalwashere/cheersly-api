const {
  SLACK_ACTIONS: { CUSTOMER_FEEDBACK },
} = require("../../../global/constants");
const {
  createSupportContextTemplate,
  createHomeSneakPeakTemplate,
} = require("../../templates");

const createHelpTemplate = (teamId, appUrl) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: ":wave: *Hey there!* How may I help you?",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "List of available commands :",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*/cheers* \n To cheer your peers",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        "*/cheers poll* \n Ask a question to your peers and get a poll (anonymous/non-anonymous)",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        "*/cheers feedback* \n Share feedback with your team (anonymous/non-anonymous)",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*/cheers sps* \n Play Stone Paper Scissors with your friend",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*/cheers onboard* \n Get onboarding instructions",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*/cheers help* \n Seek some help",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*Take me to app dashboard!*",
    },
    accessory: {
      type: "button",
      text: {
        type: "plain_text",
        text: "App Dashboard",
        emoji: true,
      },
      url: appUrl,
      value: "take_me_to_app_dashboard",
    },
  },
  createHomeSneakPeakTemplate(teamId),
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        "*Question or Feedback?* \n Let us know if you have any questions or feedback",
    },
    accessory: {
      type: "button",
      text: {
        type: "plain_text",
        text: "Share feedback",
        emoji: true,
      },
      action_id: CUSTOMER_FEEDBACK,
    },
  },
  createSupportContextTemplate(),
];

module.exports = { createHelpTemplate };
