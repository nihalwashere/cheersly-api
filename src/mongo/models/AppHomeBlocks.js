const mongoose = require("mongoose");

const collection = "AppHomeBlocks";

const AppHomeBlocksSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      index: true,
    },
    blocks: {
      type: Array,
    },
  },
  { timestamps: true }
);

const AppHomeBlocks = mongoose.model(collection, AppHomeBlocksSchema);
module.exports = AppHomeBlocks;
