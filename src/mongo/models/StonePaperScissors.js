const mongoose = require("mongoose");

const collection = "StonePaperScissors";

const StonePaperScissorsSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      index: true,
    },
    gameId: {
      type: String,
      index: true,
    },
    playerOne: {
      type: String,
      default: null,
    },
    playerTwo: {
      type: String,
      default: null,
    },
    playerOneMove: {
      type: String,
      default: null,
    },
    playerTwoMove: {
      type: String,
      default: null,
    },
    winner: {
      type: String,
      default: null,
    },
    blocks: {
      type: Array,
    },
    draw: {
      type: Boolean,
      default: false,
    },
    finished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const StonePaperScissors = mongoose.model(collection, StonePaperScissorsSchema);

module.exports = StonePaperScissors;
