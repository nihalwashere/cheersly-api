const mongoose = require("mongoose");

const { Schema } = mongoose;

const collection = "Orders";

const OrdersSchema = new Schema(
  {
    request: {
      type: Object,
    },
    response: {
      type: Object,
    },
    teamId: {
      type: String,
      index: true,
    },
    slackUserId: {
      type: String,
      index: true,
    },
  },
  { timestamps: true }
);

OrdersSchema.index({ slackUserId: 1, teamId: 1 });

const Orders = mongoose.model(collection, OrdersSchema);

module.exports = Orders;
