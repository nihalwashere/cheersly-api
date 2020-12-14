const CheersStats = require("../models/CheersStats");
const logger = require("../../global/logger");

const addCheersStats = async (payload) => {
  try {
    return await new CheersStats(payload).save();
  } catch (error) {
    logger.error(`addCheersStats() -> error : `, error, error);
  }
};

const getCheersStatsForUser = async (slackUsername) => {
  try {
    return await CheersStats.findOne({ slackUsername });
  } catch (error) {
    logger.error(`getCheersStatsForUser() -> error : `, error, error);
  }
};

module.exports = { addCheersStats, getCheersStatsForUser };
