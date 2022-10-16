const mongoose = require("mongoose");

const collection = "IceBreakerQuestions";

const IceBreakerQuestionsSchema = new mongoose.Schema(
  {
    question: {
      type: String,
    },
  },
  { timestamps: true, collection }
);

const IceBreakerQuestions = mongoose.model(
  collection,
  IceBreakerQuestionsSchema
);

module.exports = IceBreakerQuestions;
