const mongoose = require("mongoose");

const collection = "TicTacToe";

const TicTacToeSchema = new mongoose.Schema(
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
    turn: {
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

const TicTacToe = mongoose.model(collection, TicTacToeSchema);

module.exports = TicTacToe;
