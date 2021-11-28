const mongoose = require("mongoose");

const { Schema } = mongoose;

const modelName = "CustomerFeedback";

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
  }
);

const CustomerFeedback = mongoose.model(modelName, CustomerFeedbackSchema);

module.exports = CustomerFeedback;
