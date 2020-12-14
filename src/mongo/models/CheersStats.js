const mongoose = require("mongoose");

const collection = "CheersStats";

const CheersStatsSchema = new mongoose.Schema(
  {
    slackUsername: {
      type: String,
      index: true
    },
    teamId: {
      type: String,
      index: true
    },
    cheersGiven: {
      type: Number
    },
    cheersReceived: {
      type: Number
    }
  },
  { timestamps: true }
);

const CheersStats = mongoose.model(collection, CheersStatsSchema);
module.exports = CheersStats;
