const fetch = require("node-fetch");
const { GIPHY_API, GIPHY_API_KEY } = require("../global/config");
const logger = require("../global/logger");

//  GIPHY API

const getRandomGif = async tag => {
  try {
    const req = await fetch(
      `${GIPHY_API}/random?api_key=${GIPHY_API_KEY}&tag=${tag}`,
      {
        method: "GET",
      }
    );

    return await req.json();
  } catch (error) {
    logger.error("getRandomGif() -> error : ", error);
  }
};

module.exports = { getRandomGif };
