const CheersStats = require("../models/CheersStats");
const logger = require("../../global/logger");

const addCheersStats = async (payload) => {
  try {
    return await new CheersStats(payload).save();
  } catch (error) {
    logger.error(`addCheersStats() -> error : `, error);
  }
};

const getCheersStatsForTeam = async (teamId) => {
  try {
    return await CheersStats.find({ teamId });
  } catch (error) {
    logger.error(`getCheersStatsForTeam() -> error : `, error);
  }
};

const getCheersStatsForUser = async (teamId, slackUsername) => {
  try {
    return await CheersStats.findOne({ teamId, slackUsername });
  } catch (error) {
    logger.error(`getCheersStatsForUser() -> error : `, error);
  }
};

const updateCheersStatsForUser = async (slackUsername, payload) => {
  try {
    return await CheersStats.updateOne(
      { slackUsername },
      {
        $set: payload
      }
    );
  } catch (error) {
    logger.error(`updateCheersStatsForUser() -> error : `, error);
  }
};

module.exports = {
  addCheersStats,
  getCheersStatsForTeam,
  getCheersStatsForUser,
  updateCheersStatsForUser
};
