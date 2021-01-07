const mongoose = require("mongoose");

const collection = "PollAnswers";

const PollAnswersSchema = new mongoose.Schema(
  {
    slackUserId: {
      type: String,
      index: true
    },
    teamId: {
      type: String,
      index: true
    },
    pollId: {
      type: String,
      index: true
    },
    answer: {
      type: String
    }
  },
  { timestamps: true }
);

const PollAnswers = mongoose.model(collection, PollAnswersSchema);

module.exports = PollAnswers;
