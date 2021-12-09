const {
  SLACK_ACTIONS: { INTRODUCE_TO_TEAM },
} = require("../../global/constants");
const { createSupportContextTemplate } = require("../templates");

const createOnboardingTemplate = ({ user, appUrl, appHomeLink }) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `:wave: *Hey there <@${user}> ! I am Cheersly! Nice to meet you!!!*`,
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `Head over to the ${appHomeLink} tab of Cheersly to,`,
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: ":point_right: Appreciate your peers by saying cheers :beers:",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: ":point_right: Ask anything by starting a poll :bar_chart:",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        ":point_right: Share feedback with your team and get heard :speech_balloon:",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: ":point_right: Play fun Icebreaker games :ice_cube:",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        ":point_right: Play Tic Tac Toe :x: :o: or Stone Paper Scissors :v: with your co-worker",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `Deliver a fun, candid and social recognition & rewards experience for your employees. Recognize when employees align with your company values to reinforce good behavior. You can manage rewards and company values from the <${appUrl}|app dashboard>.`,
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Introduce *Cheersly* to the team!",
    },
    accessory: {
      type: "button",
      text: {
        type: "plain_text",
        text: "Introduce to team",
        emoji: true,
      },
      action_id: INTRODUCE_TO_TEAM,
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Cheers :beers:",
    },
  },
  createSupportContextTemplate(),
];
module.exports = { createOnboardingTemplate };
