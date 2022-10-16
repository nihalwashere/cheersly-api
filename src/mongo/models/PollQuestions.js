const mongoose = require("mongoose");

const collection = "PollQuestions";

const PollQuestionsSchema = new mongoose.Schema(
  {
    createdBy: {
      // slack user name
      type: String,
    },
    teamId: {
      type: String,
      index: true,
    },
    question: {
      type: String,
    },
    channel: {
      type: String,
    },
    duration: {
      type: String,
    },
    options: {
      type: Array,
    },
    pollId: {
      type: String,
      index: true,
    },
    closeAt: {
      type: Date,
      index: true,
    },
    pollSubmittedTemplate: {
      type: String,
    },
    messageTimestamp: {
      type: String,
    },
  },
  { timestamps: true, collection }
);

const PollQuestions = mongoose.model(collection, PollQuestionsSchema);

module.exports = PollQuestions;
