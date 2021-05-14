const mongoose = require("mongoose");

const collection = "Rewards";

const RewardsSchema = new mongoose.Schema(
  {
    title: {
      type: String
    },
    description: {
      type: String
    },
    price: {
      type: Number
    },
    teamId: {
      type: String,
      index: true
    }
  },
  { timestamps: true }
);

const Rewards = mongoose.model(collection, RewardsSchema);

module.exports = Rewards;
