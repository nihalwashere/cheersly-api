const mongoose = require("mongoose");

const collection = "ThisOrThatQuestions";

const ThisOrThatQuestionsSchema = new mongoose.Schema(
  {
    this: {
      type: Object,
    },
    that: {
      type: Object,
    },
  },
  { timestamps: true }
);

const ThisOrThatQuestions = mongoose.model(
  collection,
  ThisOrThatQuestionsSchema
);

module.exports = ThisOrThatQuestions;
