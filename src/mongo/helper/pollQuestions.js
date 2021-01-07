const PollQuestions = require("../models/PollQuestions");
const logger = require("../../global/logger");

const addPollQuestions = async (payload) => {
  try {
    return await new PollQuestions(payload).save();
  } catch (error) {
    logger.error(`addPollQuestions() -> error : `, error);
  }
};

module.exports = {
  addPollQuestions
};
