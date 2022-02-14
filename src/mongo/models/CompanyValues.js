const mongoose = require("mongoose");

const collection = "CompanyValues";

const CompanyValuesSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      index: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const CompanyValues = mongoose.model(collection, CompanyValuesSchema);

module.exports = CompanyValues;
