const mongoose = require("mongoose");

const { Schema } = mongoose;

const collection = "PointTopUps";

const PointTopUpsSchema = new Schema(
  {
    teamId: {
      type: String,
      index: true,
    },
    points: {
      type: Number,
    },
    pointCost: {
      type: Number,
    },
    platformFee: {
      type: Number,
    },
    totalCost: {
      type: Number,
    },
    stripeFees: {
      type: Number,
    },
    netAmount: {
      type: Number,
    },
    paymentIntentId: {
      type: String,
    },
  },
  { timestamps: true }
);

PointTopUpsSchema.index({ slackUserId: 1, teamId: 1 });

const PointTopUps = mongoose.model(collection, PointTopUpsSchema);

module.exports = PointTopUps;
