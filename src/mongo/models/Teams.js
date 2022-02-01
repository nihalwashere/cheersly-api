const mongoose = require("mongoose");

const { Schema } = mongoose;

const collection = "Teams";

const TeamsSchema = new Schema(
  {
    teamId: {
      type: String,
    },
    name: {
      type: String,
    },
    members: {
      type: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    },
    managers: {
      type: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    },
  },
  { timestamps: true }
);

const Teams = mongoose.model(collection, TeamsSchema);

module.exports = Teams;
