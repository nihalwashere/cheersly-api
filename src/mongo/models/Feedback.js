const mongoose = require("mongoose");

const { Schema } = mongoose;

const collection = "Feedback";

const FeedbackSchema = new Schema(
  {
    slackUserName: { type: String },
    teamId: { type: String },
    feedback: { type: String },
    isAnonymous: { type: Boolean },
  },
  {
    timestamps: true,
    collection,
  }
);

const Feedback = mongoose.model(collection, FeedbackSchema);

module.exports = Feedback;
