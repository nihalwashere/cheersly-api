const PollAnswers = require("../models/PollAnswers");
const logger = require("../../global/logger");

const addPollAnswers = async (payload) => {
  try {
    return await new PollAnswers(payload).save();
  } catch (error) {
    logger.error(`addPollAnswers() -> error : `, error);
  }
};

const getAllPollAnswers = async (pollId) => {
  try {
    return await PollAnswers.find({ pollId });
  } catch (error) {
    logger.error(`getAllPollAnswers() -> error : `, error);
  }
};

const getPollAnswerForUser = async (slackUserId, teamId, pollId) => {
  try {
    return await PollAnswers.findOne({
      slackUserId,
      teamId,
      pollId
    });
  } catch (error) {
    logger.error(`getPollAnswerForUser() -> error : `, error);
  }
};

const updatePollAnswerForUser = async (slackUserId, teamId, pollId, answer) => {
  try {
    return await PollAnswers.updateOne(
      {
        slackUserId,
        teamId,
        pollId
      },
      { $set: { answer } }
    );
  } catch (error) {
    logger.error(`updatePollAnswerForUser() -> error : `, error);
  }
};

module.exports = {
  addPollAnswers,
  getAllPollAnswers,
  getPollAnswerForUser,
  updatePollAnswerForUser
};
