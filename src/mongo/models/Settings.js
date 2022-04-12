const mongoose = require("mongoose");

const { Schema } = mongoose;

const collection = "Settings";

const SettingsSchema = new Schema(
  {
    teamId: {
      type: String,
      index: true,
    },
    isActivated: {
      type: Boolean,
    },
    admins: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    allowanceReloaded: {
      type: Boolean,
    },
    pointsAboutToExpire: {
      type: Boolean,
    },
    inactivityReminders: {
      type: Boolean,
    },
    pointsAvailableToRedeem: {
      type: Boolean,
    },
    requireCompanyValues: {
      type: Boolean,
    },
    enableSharingGiphys: {
      type: Boolean,
    },
    enableGiftCards: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model(collection, SettingsSchema);

module.exports = Settings;
