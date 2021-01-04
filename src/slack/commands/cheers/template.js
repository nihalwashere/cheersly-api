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
  let wrappedText = "";

  users.map((user) => {
    const message = `@${user.recipient} now has ${user.cheersReceived} cheers :heart:`;
    wrappedText += message + "\n";
  });

  wrappedText += `_*${description}*_`;

  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: wrappedText
      }
    }
  ];
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

module.exports = {
  createGiphyTemplate,
  createCheersTemplate,
  createInvalidRecipientsTemplate
};
