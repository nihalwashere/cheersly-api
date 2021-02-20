const createCheersSubmittedTemplate = (user_name) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `@${user_name} shared some cheers`
      }
    }
  ];
};

const createInvalidRecipientsTemplate = () => {
  return {
    type: "modal",
    title: {
      type: "plain_text",
      text: "Oops!",
      emoji: true
    },
    close: {
      type: "plain_text",
      text: "OK",
      emoji: true
    },
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Please mention someone to say cheers!"
        }
      }
    ]
  };
};

const createSelfCheersTemplate = () => {
  return {
    type: "modal",
    title: {
      type: "plain_text",
      text: "Oops!",
      emoji: true
    },
    close: {
      type: "plain_text",
      text: "OK",
      emoji: true
    },
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "You cannot share cheers with yourself. You should share cheers with your peers! If you are happy spread it rather that keeping it with yourself!!!"
        }
      }
    ]
  };
};

module.exports = {
  createCheersSubmittedTemplate,
  createInvalidRecipientsTemplate,
  createSelfCheersTemplate
};
