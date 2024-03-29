const mongoose = require("mongoose");

const collection = "Auth";

const AuthSchema = new mongoose.Schema(
  {
    slackInstallation: {
      type: Object,
    },
    slackDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    appIntroducedToTeam: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

AuthSchema.index({ "slackInstallation.team.id": 1 });

const Auth = mongoose.model(collection, AuthSchema);

module.exports = Auth;
