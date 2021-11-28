const AppHomeBlocks = require("../models/AppHomeBlocks");
const logger = require("../../global/logger");

const getAppHpmeBlocksForTeam = async teamId => {
  try {
    return await AppHomeBlocks.findOne({ teamId });
  } catch (error) {
    logger.error(`getAppHpmeBlocksForTeam() -> error : `, error);
  }
};

const upsertAppHpmeBlocks = async (teamId, payload) => {
  try {
    return await AppHomeBlocks.updateOne(
      { teamId },
      { $set: payload },
      { upsert: true }
    );
  } catch (error) {
    logger.error(`upsertAppHpmeBlocks() -> error : `, error);
  }
};

module.exports = {
  getAppHpmeBlocksForTeam,
  upsertAppHpmeBlocks,
};
