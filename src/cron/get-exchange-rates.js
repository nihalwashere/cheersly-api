const mongoose = require("mongoose");
const ExchangeRatesModel = require("../mongo/models/ExchangeRates");
const { getExchangeRates } = require("../tango-card/api");
const { MONGO_URL, MONGO_OPTIONS } = require("../global/config");
const logger = require("../global/logger");

const service = async () => {
  try {
    logger.info("GET EXCHANGE RATES CRON SERVICE STARTED");
    const response = await getExchangeRates();

    if (response && response.exchangeRates && response.exchangeRates.length) {
      await ExchangeRatesModel.deleteMany({});
      logger.debug("FLUSHED CURRENT EXCHANGE RATES");

      await ExchangeRatesModel.insertMany(response.exchangeRates);
      logger.debug("ADDED NEW EXCHANGE RATES");
    }
  } catch (error) {
    logger.error(
      "GET EXCHANGE RATES CRON SERVICE STARTED FAILED -> error : ",
      error
    );
  }
};

// Connect To Database
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL, {
  ...MONGO_OPTIONS,
});

// On Connection
mongoose.connection.on("connected", async () => {
  try {
    logger.info("CONNECTED TO DATABASE FROM GET EXCHANGE RATES CRON SERVICE");

    // execute service
    await service();

    mongoose.disconnect();
  } catch (error) {
    logger.error(error);
    mongoose.disconnect();
  }
});

// On Error
mongoose.connection.on("error", error => {
  logger.error(
    "DATABASE ERROR FROM GET EXCHANGE RATES CRON SERVICE -> error : ",
    error
  );
});
