const mongoose = require("mongoose");

const { Schema } = mongoose;

const collection = "CustomerFeedback";

const CustomerFeedbackSchema = new Schema(
  {
    slackUserId: { type: String },
    teamId: { type: String },
    regarding: { type: String },
    description: { type: String },
    resolved: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection,
  }
);

const CustomerFeedback = mongoose.model(collection, CustomerFeedbackSchema);

module.exports = CustomerFeedback;
