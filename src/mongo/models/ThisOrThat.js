const mongoose = require("mongoose");

const collection = "ThisOrThat";

const ThisOrThatSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      index: true,
    },
    gameId: {
      type: String,
      index: true,
    },
    question: {
      type: Object,
    },
    blocks: {
      type: Array,
    },
    votes: {
      this: {
        type: Array,
        default: [],
      },
      that: {
        type: Array,
        default: [],
      },
    },
    messageTimestamp: {
      type: String,
    },
  },
  { timestamps: true }
);

const ThisOrThat = mongoose.model(collection, ThisOrThatSchema);

module.exports = ThisOrThat;
