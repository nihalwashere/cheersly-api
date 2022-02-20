const mongoose = require("mongoose");

const collection = "CheersStats";

const CheersStatsSchema = new mongoose.Schema(
  {
    slackUserId: {
      type: String,
      index: true,
    },
    recognitionTeamId: {
      type: String,
      index: true,
    },
    teamId: {
      type: String,
      index: true,
    },
    cheersGiven: {
      type: Number,
    },
    cheersReceived: {
      type: Number,
    },
    cheersRedeemable: {
      type: Number,
    },
  },
  { timestamps: true }
);

CheersStatsSchema.index({ slackUsername: 1, teamId: 1 });

const CheersStats = mongoose.model(collection, CheersStatsSchema);

module.exports = CheersStats;
