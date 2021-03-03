const createOnboardingTemplate = () => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          ":wave: *Hey there!* \n\n *I am Cheersly!* Nice to meet you!. I am here to build an awesome cheerful team!"
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
          "You can spread joy amongst your peers by using the command `/cheers` in the form ```/cheers @tom @jerry Thanks for jumping in the client call at the last minute :)```"
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "You can use me in channels where I am in and in the app's DM. To invite me to a channel, use the command `/invite @Cheersly`"
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "You can get a birds eye view of your team's mood and keep track of who has given or received the most cheers. If you feel low, just visit the app's home tab and recall all the good work you have done and have been appreciated for so far."
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
          "*Polls* help you to ask a question to your peers and analyze their responses. You can submit a poll using the command `/cheers poll`"
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
