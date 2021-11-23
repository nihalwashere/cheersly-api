const mongoose = require("mongoose");

const collection = "StonePaperScissors";

const StonePaperScissorsSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      index: true
    },
    gameId: {
      type: String,
      index: true
    },
    playerOne: {
      type: String
    },
    playerTwo: {
      type: String
    },
    playerOneMove: {
      type: String
    },
    playerTwoMove: {
      type: String
    },
    winner: {
      type: String
    },
    draw: {
      type: Boolean,
      default: false
    },
    finished: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const StonePaperScissors = mongoose.model(collection, StonePaperScissorsSchema);

module.exports = StonePaperScissors;
