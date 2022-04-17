const mongoose = require("mongoose");

const collection = "Subscriptions";

const SubscriptionSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      index: true,
    },
    paymentMethodId: {
      type: String,
    },
    teamId: {
      type: String,
      index: true,
    },
    isTrialPeriod: {
      type: Boolean,
    },
    subscribedOn: {
      type: Date,
    },
    expiresOn: {
      type: Date,
    },
  },
  { timestamps: true }
);

SubscriptionSchema.index({ customerId: 1, teamId: 1 });

const Subscription = mongoose.model(collection, SubscriptionSchema);

module.exports = Subscription;
