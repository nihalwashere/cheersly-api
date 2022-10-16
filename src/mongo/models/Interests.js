const mongoose = require("mongoose");

const collection = "Interests";

const InterestsSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      index: true,
    },
    userId: {
      type: String,
      index: true,
    },
    interests: {
      type: Array,
    },
  },
  { timestamps: true, collection }
);

const Interests = mongoose.model(collection, InterestsSchema);

module.exports = Interests;
