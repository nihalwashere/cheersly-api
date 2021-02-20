const CustomerFeedback = require("../models/CustomerFeedback");
const logger = require("../../global/logger");

const addCustomerFeedback = async (payload) => {
  try {
    return await new CustomerFeedback(payload).save();
  } catch (error) {
    logger.error(
      "addCustomerFeedback() -> Failed to add customer feedback",
      error
    );
  }
};

module.exports = { addCustomerFeedback };
