const mongoose = require("mongoose");

const collection = "Subscriptions";

const SubscriptionSchema = new mongoose.Schema(
  {
    subscribedBy: {
      type: mongoose.Schema.Types.Mixed,
    },
    slackTeamId: {
      type: String,
      index: true,
    },
    isTrialPeriod: {
      type: Boolean,
      default: true,
    },
    subscribedOn: {
      type: Date,
    },
    nextDueDate: {
      type: Date,
    },
    ultimateDueDate: {
      type: Date,
    },
    totalUsers: {
      type: String,
    },
    users: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model(collection, SubscriptionSchema);
module.exports = Subscription;
