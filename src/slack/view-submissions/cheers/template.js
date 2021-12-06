const createSenderCheersSubmittedTemplate = senderUsername => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `@${senderUsername} just shared in some cheers :heart:`,
      },
    },
  ];
};

const createCheersSubmittedTemplate = ({
  users,
  reason,
  giphyUrl,
  companyValues,
}) => {
  const blocks = [];

  users.map(user => {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `@${user.recipient} now has ${user.cheersReceived} cheers :beers:`,
      },
    });
  });

  if (reason) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*For reason:*\n" + "```" + `${reason}` + "```",
      },
    });
  }

  if (companyValues && companyValues.length) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*Company values favored :*\n" +
          "```" +
          `${companyValues.join(" ")}` +
          "```",
      },
    });
  }

  if (giphyUrl) {
    blocks.push({
      type: "image",
      image_url: giphyUrl,
      alt_text: "cheers",
    });
  }

  return blocks;
};

const createSelectPeersTemplate = () => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "Please select your peers while sharing cheers, you should not share cheers with yourself! :smile:",
      },
    },
  ];
};

module.exports = {
  createSenderCheersSubmittedTemplate,
  createCheersSubmittedTemplate,
  createSelectPeersTemplate,
};
