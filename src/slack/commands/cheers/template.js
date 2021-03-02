const createGiphyTemplate = (text, url) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text
      }
    },
    {
      type: "image",
      image_url: url,
      alt_text: "cheers"
    }
  ];
};

// {
//   type: "image",
//   image_url: "https://cheersly.herokuapp.com/giphy_attribution_mark.png",
//   alt_text: "Powered by GIPHY"
// },

const createCheersTemplate = (users, description) => {
  const blocks = [];

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

  if (description) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `_*${description}*_`
      }
    });
  }

  return blocks;
};

const createInvalidRecipientsTemplate = () => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "_*Oops! Please mention someone to say cheers...*_"
      }
    }
  ];
};

const createSelfCheersTemplate = () => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "_*Whoa! You should share cheers with your peers! If you are happy spread it rather that keeping it with yourself...*_"
      }
    }
  ];
};

module.exports = {
  createGiphyTemplate,
  createCheersTemplate,
  createInvalidRecipientsTemplate,
  createSelfCheersTemplate
};
