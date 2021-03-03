const mongoose = require("mongoose");

const { Schema } = mongoose;

const modelName = "Feedback";

const FeedbackSchema = new Schema(
  {
    slackUserName: { type: String },
    teamId: { type: String },
    feedback: { type: String },
    isAnonymous: { type: Boolean }
  },
  {
    timestamps: true
  }
);

const Feedback = mongoose.model(modelName, FeedbackSchema);

module.exports = Feedback;
