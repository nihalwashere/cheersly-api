const TeamPointBalanceModel = require("../mongo/models/TeamPointBalance");
const logger = require("../global/logger");

const createDefaultTeamPointBalance = async teamId => {
  try {
    await new TeamPointBalanceModel({ teamId, balance: 0 }).save();
  } catch (error) {
    logger.error("createDefaultTeamPointBalance() -> error : ", error);
  }
};

module.exports = { createDefaultTeamPointBalance };
