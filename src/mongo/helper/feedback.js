const Feedback = require("../models/Feedback");
const logger = require("../../global/logger");

const addFeedback = async payload => {
  try {
    return await new Feedback(payload).save();
  } catch (error) {
    logger.error("addFeedback() -> Failed to add feedback", error);
  }
};

module.exports = { addFeedback };
