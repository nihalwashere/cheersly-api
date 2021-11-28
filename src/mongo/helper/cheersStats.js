const CheersStats = require("../models/CheersStats");
const logger = require("../../global/logger");

const addCheersStats = async payload => {
  try {
    return await new CheersStats(payload).save();
  } catch (error) {
    logger.error(`addCheersStats() -> error : `, error);
  }
};

const getCheersStatsForTeam = async teamId => {
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
        $set: payload,
      }
    );
  } catch (error) {
    logger.error(`updateCheersStatsForUser() -> error : `, error);
  }
};

const getTopCheersReceiversForTeam = async teamId => {
  try {
    return await CheersStats.find({ teamId }).sort({ cheersReceived: -1 });
  } catch (error) {
    logger.error(`getTopCheersReceiversForTeam() -> error : `, error);
  }
};

const paginateCheersStatsForTeam = async (teamId, pageIndex, pageSize) => {
  try {
    const totalCount = await CheersStats.find({
      teamId,
    }).countDocuments({});

    const data = await CheersStats.find({ teamId })
      .sort({ created_at: 1 })
      .skip(pageSize * pageIndex)
      .limit(pageSize);

    return {
      data,
      totalCount: Number(totalCount),
      totalPages: Math.ceil(totalCount / pageSize),
    };
  } catch (error) {
    logger.error(`paginateCheersStatsForTeam() -> error : `, error);
  }
};

module.exports = {
  addCheersStats,
  getCheersStatsForTeam,
  getCheersStatsForUser,
  updateCheersStatsForUser,
  getTopCheersReceiversForTeam,
  paginateCheersStatsForTeam,
};
