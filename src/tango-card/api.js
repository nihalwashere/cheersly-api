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
  Accept: "application/json",
  "Content-Type": "application/json",
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

const placeOrder = async payload => {
  try {
    const req = await fetch(`${TANGO_CARD_SANDOX_API_BASE_URL}/orders`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    const { status } = req;

    const response = await req.json();

    return { status, response };
  } catch (error) {
    logger.error("placeOrder() : error -> ", error);
  }
};

const getExchangeRates = async () => {
  try {
    const req = await fetch(`${TANGO_CARD_SANDOX_API_BASE_URL}/exchangerates`, {
      method: "GET",
      headers: getHeaders(),
    });

    const res = await req.json();

    return res;
  } catch (error) {
    logger.error("getExchangeRates() : error -> ", error);
  }
};

module.exports = { getCatalogs, placeOrder, getExchangeRates };
