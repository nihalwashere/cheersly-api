const mongoose = require("mongoose");

const collection = "TwoTruthsAndALie";

const TwoTruthsAndALieSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      index: true,
    },
    gameId: {
      type: String,
      index: true,
    },
    statementOne: {
      id: { type: String },
      value: { type: String },
    },
    statementTwo: {
      id: { type: String },
      value: { type: String },
    },
    statementThree: {
      id: { type: String },
      value: { type: String },
    },
    lie: {
      id: { type: String },
      value: { type: String },
    },
    votes: {
      correct: {
        type: Array,
        default: [],
      },
      wrong: {
        type: Array,
        default: [],
      },
    },
    messageTimestamp: {
      type: String,
    },
    blocks: {
      type: Array,
    },
  },
  { timestamps: true }
);

const TwoTruthsAndALie = mongoose.model(collection, TwoTruthsAndALieSchema);

module.exports = TwoTruthsAndALie;
