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

CheersSchema.index({ from: 1, teamId: 1 });
CheersSchema.index({ to: 1, teamId: 1 });

const Cheers = mongoose.model(collection, CheersSchema);

module.exports = Cheers;
