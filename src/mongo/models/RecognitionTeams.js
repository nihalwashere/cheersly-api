const mongoose = require("mongoose");

const { Schema } = mongoose;

const collection = "RecognitionTeams";

const RecognitionTeamsSchema = new Schema(
  {
    teamId: {
      type: String,
      index: true,
    },
    name: {
      type: String,
      default: "",
    },
    channel: {
      type: String,
      default: "",
    },
    pointAllowance: {
      type: String,
      default: "",
    },
    pointAmountOptions: {
      type: Array,
      default: [],
    },
    managers: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
  },
  { timestamps: true }
);

const RecognitionTeams = mongoose.model(collection, RecognitionTeamsSchema);

module.exports = RecognitionTeams;
