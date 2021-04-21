const createCheersSubmittedTemplate = (
  senderUsername,
  users,
  reason,
  giphyUrl
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
        text: `*For reason:*\n${reason}`
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
          "Hey there! You should select your peers while sharing cheers, trust me, you don't want to share cheers with bots and yourself!"
      }
    }
  ];
};

module.exports = {
  createCheersSubmittedTemplate,
  createSelectPeersTemplate
};
