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

const TeamPointBalance = mongoose.model(collection, TeamPointBalanceSchema);

module.exports = TeamPointBalance;
