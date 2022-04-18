const mongoose = require("mongoose");

const { Schema } = mongoose;

const collection = "TeamPointBalance";

const TeamPointBalanceSchema = new Schema(
  {
    teamId: {
      type: String,
      index: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, collection }
);

TeamPointBalanceSchema.index({ slackUserId: 1, teamId: 1 });

const TeamPointBalance = mongoose.model(collection, TeamPointBalanceSchema);

module.exports = TeamPointBalance;
