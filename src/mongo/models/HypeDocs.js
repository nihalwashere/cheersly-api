const mongoose = require("mongoose");

const collection = "HypeDocs";

const HypeDocsSchema = new mongoose.Schema(
  {
    userId: {
      type: String
    },
    title: {
      type: String
    },
    category: {
      type: String
    },
    when: {
      type: Date
    },
    content: {
      type: String
    }
  },
  { timestamps: true }
);

const HypeDocs = mongoose.model(collection, HypeDocsSchema);

module.exports = HypeDocs;
