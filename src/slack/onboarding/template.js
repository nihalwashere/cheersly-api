const { getAppHomeLink } = require("../../utils/common");
const { createSupportContextTemplate } = require("../templates");

const createOnboardingTemplate = (teamId, appUrl) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        ":wave: *Hey there!* \n\n *I am Cheersly!* Nice to meet you! I am here to build an awesome cheerful team!"
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*How it works?*"
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        ":point_right: You can cheer your peers by using the command `/cheers`"
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        ":point_right: You can ask a question to your peers and get a poll (anonymous/non-anonymous) using the command `/cheers poll`"
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        ":point_right: You can share feedback (anoymous/non-anonymous) with your team and get heard. To submit a feedback, use the command `/cheers feedback`"
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        "You can also run all of the above commands through shortcuts in Slack."
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        "You can use me in channels where I am in and in the app's DM. To invite me to a channel, use the command `/invite @Cheersly` and get onboarding instructions using \n `/cheers onboard`"
    }
  },
  {
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text:
          "Note: Please invite Cheersly to all the public and private channels you would like to use Cheersly in."
      }
    ]
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `You can get a birds eye view of your team's mood and keep track of who has given or received the most cheers. If you feel low, just visit the app's ${getAppHomeLink(
        teamId
      )} tab and recall all the good work you have been appreciated for so far!`
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `You can also view the leaderboard for your team in the <${appUrl}|app dashboard> and drill down on who has given or received the most cheers for a specific duration and reward them.`
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `You can add, edit or remove company values from the <${appUrl}|app dashboard>, by default, we have included a few company values for your team.`
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        "You can exchange your earned `cheers` against rewards! You can manage rewards from the " +
        `<${appUrl}|app dashboard>.`
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Cheers :beers:"
    }
  },
  createSupportContextTemplate()
];

const createPersonalOnboardingTemplate = (name, teamId) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `Hey @${name}`
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        "Your team added *Cheersly* to this workspace. Cheersly is an employee engagement and peer recognition platform to build cheerful teams. You can give cheers, conduct anonymous polls and share feedback."
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `Remote teams use Cheersly to increase team engagement and the feeling of togetherness. Visit the ${getAppHomeLink(
        teamId
      )} tab of Cheersly to view your stats.`
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Use the command `/cheers help` to learn more."
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Cheers :beers:"
    }
  },
  createSupportContextTemplate()
];

module.exports = { createOnboardingTemplate, createPersonalOnboardingTemplate };
