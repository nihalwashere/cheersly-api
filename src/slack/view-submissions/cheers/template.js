const createCheersSubmittedTemplate = (
  senderUsername,
  users,
  reason,
  giphyUrl,
  companyValues
) => {
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `@${senderUsername} just shared in some cheers :heart:`
      }
    }
  ];

  const n = 5;

  const result = new Array(Math.ceil(users.length / n))
    .fill()
    .map(() => users.splice(0, n));

  for (let i = 0; i < result.length; i++) {
    const userArr = result[i];

    let wrappedText = "";

    for (let j = 0; j < userArr.length; j++) {
      const user = userArr[j];

      const message = `@${user.recipient} now has ${user.cheersReceived} cheers :beers:`;

      wrappedText += message + "\n";
    }

    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: wrappedText
      }
    });
  }

  if (reason) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*For reason:*\n" + "```" + `${reason}` + "```"
      }
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
          "```"
      }
    });
  }

  if (giphyUrl) {
    blocks.push({
      type: "image",
      image_url: giphyUrl,
      alt_text: "cheers"
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
          "Hey there! Please select your peers while sharing cheers, you should not share cheers with yourself! :smile:"
      }
    }
  ];
};

module.exports = {
  createCheersSubmittedTemplate,
  createSelectPeersTemplate
};
