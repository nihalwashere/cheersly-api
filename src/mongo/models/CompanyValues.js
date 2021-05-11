const mongoose = require("mongoose");

const collection = "CompanyValues";

const CompanyValuesSchema = new mongoose.Schema(
  {
    title: {
      type: String
    },
    description: {
      type: String
    },
    teamId: {
      type: String,
      index: true
    }
  },
  { timestamps: true }
);

const CompanyValues = mongoose.model(collection, CompanyValuesSchema);

module.exports = CompanyValues;
