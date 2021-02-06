const PollQuestions = require("../models/PollQuestions");
const logger = require("../../global/logger");

const addPollQuestions = async (payload) => {
  try {
    return await new PollQuestions(payload).save();
  } catch (error) {
    logger.error(`addPollQuestions() -> error : `, error);
  }
};

const getClosedPolls = async () => {
  try {
    return await PollQuestions.find({ closeAt: { $lt: new Date() } });
  } catch (error) {
    logger.error(`getClosedPolls() -> error : `, error);
  }
};

module.exports = {
  addPollQuestions,
  getClosedPolls
};
