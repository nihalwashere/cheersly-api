const mongoose = require("mongoose");

const { Schema } = mongoose;

const collection = "Cheers";

const CheersSchema = new Schema(
  {
    from: {
      id: {
        type: String,
      },
      name: {
        type: String,
      },
    },
    to: {
      id: {
        type: String,
      },
      name: {
        type: String,
      },
    },
    channel: {
      id: {
        type: String,
      },
      name: {
        type: String,
      },
    },
    companyValues: {
      type: Array,
    },
    reason: {
      type: String,
    },
    points: {
      type: Number,
    },
    teamId: {
      type: String,
      index: true,
    },
    recognitionTeamId: {
      type: Schema.Types.ObjectId,
      ref: "RecognitionTeams",
      index: true,
    },
  },
  { timestamps: true, collection }
);

CheersSchema.index({ "from.id": 1, teamId: 1 });
CheersSchema.index({ "to.id": 1, teamId: 1 });

const Cheers = mongoose.model(collection, CheersSchema);

module.exports = Cheers;
