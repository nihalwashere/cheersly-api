const createGiphyTemplate = (url) => {
  return [
    {
      type: "image",
      image_url: url,
      alt_text: "cheers"
    }
  ];
};

module.exports = { createGiphyTemplate };
