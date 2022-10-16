const mongoose = require("mongoose");

const { getUserRoles } = require("../../enums/userRoles");

const collection = "User";

const UserSchema = new mongoose.Schema(
  {
    slackUserData: {
      type: Object,
    },
    slackDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    appHomePublished: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: getUserRoles(),
      index: true,
    },
    country: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, collection }
);

UserSchema.index({ "slackUserData.id": 1 });
UserSchema.index({ "slackUserData.team_id": 1 });

const User = mongoose.model(collection, UserSchema);

module.exports = User;
