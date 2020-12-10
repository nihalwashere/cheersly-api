const createHelpTemplate = () => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Hey there!* How may I help you?"
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
        text: "*/cheers help* \n To seek some help"
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*/cheers @tom @jerry Thanks for the quick review on my pull request* \n To cheer your peer"
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
