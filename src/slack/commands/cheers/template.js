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

module.exports = { createGiphyTemplate };
