const mongoose = require("mongoose");
const { getActivityTypes } = require("../../enums/activityTypes");

const { Schema } = mongoose;

const collection = "Activity";

const ActivitySchema = new Schema(
  {
    data: {
      type: Object,
    },
    type: {
      type: String,
      enum: getActivityTypes(),
      index: true,
    },
    teamId: {
      type: String,
      index: true,
    },
  },
  { timestamps: true, collection }
);

ActivitySchema.index({ type: 1, teamId: 1 });

const Activity = mongoose.model(collection, ActivitySchema);

module.exports = Activity;
