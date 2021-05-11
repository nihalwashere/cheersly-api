const createOnboardingTemplate = () => {
  return [
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
        text:
          "You can get a birds eye view of your team's mood and keep track of who has given or received the most cheers. If you feel low, just visit the app's home tab and recall all the good work you have been appreciated for so far!"
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "You can also view the leaderboard for your team in the app dashboard and drill down on who has given or received the most cheers for a specific duration and reward them."
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "You can add, edit or remove company values from the app dashboard, by default, we have included a few company values for your team."
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Cheers :beers:"
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

module.exports = { createOnboardingTemplate };
