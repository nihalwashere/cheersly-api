const mongoose = require("mongoose");

const collection = "Topics";

const TopicsSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      index: true
    },
    topics: {
      type: Array
    }
  },
  { timestamps: true }
);

const Topics = mongoose.model(collection, TopicsSchema);

module.exports = Topics;
