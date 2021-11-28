const Cheers = require("../models/Cheers");
const logger = require("../../global/logger");

const addCheers = async payload => {
  try {
    return await new Cheers(payload).save();
  } catch (error) {
    logger.error(`addCheers() -> error : `, error);
  }
};

const getCheersForTeam = async (teamId, from, to) => {
  try {
    const query = { teamId };

    if (from && to) {
      query.$and = [
        { createdAt: { $gte: new Date(from) } },
        { createdAt: { $lte: new Date(to) } },
      ];
    }

    return await Cheers.find(query);
  } catch (error) {
    logger.error(`getCheersForTeam() -> error : `, error);
  }
};

const getCheersGivenForUser = async (teamId, from) => {
  try {
    return await Cheers.countDocuments({ teamId, from });
  } catch (error) {
    logger.error(`getCheersGivenForUser() -> error : `, error);
  }
};

const getCheersReceivedForUser = async (teamId, to) => {
  try {
    return await Cheers.countDocuments({ teamId, to });
  } catch (error) {
    logger.error(`getCheersReceivedForUser() -> error : `, error);
  }
};

module.exports = {
  addCheers,
  getCheersForTeam,
  getCheersGivenForUser,
  getCheersReceivedForUser,
};
