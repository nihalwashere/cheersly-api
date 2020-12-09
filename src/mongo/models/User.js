const mongoose = require("mongoose");

const collection = "User";

const UserSchema = new mongoose.Schema(
  {
    slackUserData: {
      type: Object
    },
    slackDeleted: {
      type: Boolean,
      default: false,
      index: true
    },
    appHomePublished: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

UserSchema.index({ "slackUserData.id": 1 });
UserSchema.index({ "slackUserData.team_id": 1 });

const User = mongoose.model(collection, UserSchema);
module.exports = User;
