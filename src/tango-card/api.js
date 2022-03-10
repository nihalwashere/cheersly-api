const fetch = require("node-fetch");
const {
  TANGO_CARD_SANDOX_API_BASE_URL,
  TANGO_CARD_USERNAME,
  TANGO_CARD_PASSWORD,
} = require("../global/config");
const logger = require("../global/logger");

//  TANGO CARD API

const getHeaders = () => ({
  Authorization: `Basic ${Buffer.from(
    `${TANGO_CARD_USERNAME}:${TANGO_CARD_PASSWORD}`,
    "utf-8"
  ).toString("base64")}`,
});

const getCatalogs = async filters => {
  try {
    const req = await fetch(
      `${TANGO_CARD_SANDOX_API_BASE_URL}/catalogs${filters}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    const res = await req.json();

    return res;
  } catch (error) {
    logger.error("getCatalogs() : error -> ", error);
  }
};

module.exports = { getCatalogs };
