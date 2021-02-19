const Cheers = require("../models/Cheers");
const logger = require("../../global/logger");

const addCheers = async (payload) => {
  try {
    return await new Cheers(payload).save();
  } catch (error) {
    logger.error(`addCheers() -> error : `, error);
  }
};

const getCheersForTeam = async (teamId, fromDate, toDate) => {
  try {
    return await Cheers.find({ teamId });
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
  getCheersReceivedForUser
};
