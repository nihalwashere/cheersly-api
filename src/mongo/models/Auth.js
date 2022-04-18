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

    // getting started steps
    recognitionTeamCreated: {
      type: Boolean,
      default: false,
    },
    companyValuesCreated: {
      type: Boolean,
      default: false,
    },
    rewardRedemptionsEnabled: {
      type: Boolean,
      default: false,
    },
    appEnabled: {
      type: Boolean,
      default: false,
    },
    appIntroducedToTeam: {
      type: Boolean,
      default: false,
    },
    paymentMethodAdded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, collection }
);

AuthSchema.index({ "slackInstallation.team.id": 1 });

const Auth = mongoose.model(collection, AuthSchema);

module.exports = Auth;
