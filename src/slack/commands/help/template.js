const createHelpTemplate = () => {
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
        text: "*/cheers poll \n Submit a Poll"
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*/cheers @tom @jerry Thanks for jumping in the client call at the last minute :)* \n To cheer your peers"
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
