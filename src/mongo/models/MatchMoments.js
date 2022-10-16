const mongoose = require("mongoose");

const collection = "MatchMoments";

const MatchMomentsSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      index: true,
    },
    day: {
      type: String,
    },
    time: {
      type: String,
    },
    timezone: {
      type: String,
    },
  },
  { timestamps: true, collection }
);

const MatchMoments = mongoose.model(collection, MatchMomentsSchema);

module.exports = MatchMoments;
