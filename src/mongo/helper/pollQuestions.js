const PollQuestions = require("../models/PollQuestions");
const logger = require("../../global/logger");

const addPollQuestions = async payload => {
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

const markPollAsClosed = async pollId => {
  try {
    return await PollQuestions.updateOne(
      { pollId },
      { $set: { closeAt: null } }
    );
  } catch (error) {
    logger.error(`markPollAsClosed() -> error : `, error);
  }
};

module.exports = {
  addPollQuestions,
  getClosedPolls,
  markPollAsClosed,
};
