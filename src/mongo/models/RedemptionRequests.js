const mongoose = require("mongoose");

const {
  getRedemptionRequestStatus,
} = require("../../enums/redemptionRequestStatus");

const collection = "RedemptionRequests";

const { Schema } = mongoose;

const RedemptionRequestsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reward: {
      type: Schema.Types.ObjectId,
      ref: "Rewards",
    },
    status: {
      type: String,
      enum: getRedemptionRequestStatus(),
    },
    teamId: {
      type: String,
      index: true,
    },
  },
  { timestamps: true, collection }
);

const RedemptionRequests = mongoose.model(collection, RedemptionRequestsSchema);

module.exports = RedemptionRequests;
