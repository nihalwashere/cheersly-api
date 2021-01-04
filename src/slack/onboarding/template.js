const createOnboardingTemplate = () => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          ":wave: *Hey there!* \n\n *I am Cheersly!* Nice to meet you!. You can use me to share in some cheers with your peers."
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
          "You can get a birds eye view of your team's mood and keep track of who has given or received the most cheers. If you feel low, just visit the app's home tab and recall all the good work you have done and have been appreciated for so far!"
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "_*You should share in some cheers with your peers because it makes the recipient feel good about themselves and this can help to boost their performance. Cheersly provides the kind of positive experience or uplift that can increase people's morale, motivation and engagement, and renew their commitment to their organization!!!*_"
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
