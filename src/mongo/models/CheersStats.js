const mongoose = require("mongoose");

const collection = "CheersStats";

const CheersStatsSchema = new mongoose.Schema(
  {
    slackUserId: {
      type: String,
      index: true
    },
    teamId: {
      type: String,
      index: true
    },
    cheersGiven: {
      type: String
    },
    cheersReceived: {
      type: String
    }
  },
  { timestamps: true }
);

const CheersStats = mongoose.model(collection, CheersStatsSchema);
module.exports = CheersStats;
