const mongoose = require("mongoose");

const collection = "Cheers";

const CheersSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      index: true
    },
    to: {
      type: String,
      index: true
    },
    teamId: {
      type: String,
      index: true
    }
  },
  { timestamps: true }
);

const Cheers = mongoose.model(collection, CheersSchema);

module.exports = Cheers;
