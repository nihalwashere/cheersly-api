const mongoose = require("mongoose");

const collection = "AppHomeCommonBlocks";

const AppHomeCommonBlocksSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      index: true
    },
    blocks: {
      type: Array
    }
  },
  { timestamps: true }
);

const AppHomeCommonBlocks = mongoose.model(
  collection,
  AppHomeCommonBlocksSchema
);
module.exports = AppHomeCommonBlocks;
