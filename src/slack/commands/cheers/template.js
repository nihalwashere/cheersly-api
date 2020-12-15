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
      image_url: "https://cheersly.herokuapp.com/giphy_attribution_mark.png",
      alt_text: "Powered by GIPHY"
    },
    {
      type: "image",
      image_url: url,
      alt_text: "cheers"
    }
  ];
};

module.exports = { createGiphyTemplate };
