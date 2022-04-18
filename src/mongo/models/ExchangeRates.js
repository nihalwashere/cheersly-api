const mongoose = require("mongoose");

const { Schema } = mongoose;

const collection = "ExchangeRates";

const ExchangeRatesSchema = new Schema(
  {
    lastModifiedDate: {
      type: Date,
    },
    rewardCurrency: {
      type: String,
    },
    baseCurrency: {
      type: String,
    },
    baseFx: {
      type: Number,
    },
  },
  { timestamps: true, collection }
);

const ExchangeRates = mongoose.model(collection, ExchangeRatesSchema);

module.exports = ExchangeRates;
