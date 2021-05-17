const Rewards = require("../models/Rewards");
const DefaultRewards = require("../../utils/defaults/rewards");
const logger = require("../../global/logger");

const getRewardsByTeamId = async (teamId) => {
  try {
    return await Rewards.find({ teamId, deleted: { $ne: true } });
  } catch (error) {
    logger.error(`getRewardsByTeamId() -> error : `, error);
  }
};

const getRewardById = async (_id) => {
  try {
    return await Rewards.findOne({ _id });
  } catch (error) {
    logger.error(`getRewardById() -> error : `, error);
  }
};

const addRewards = async (payload) => {
  try {
    return await new Rewards(payload).save();
  } catch (error) {
    logger.error(`addRewards() -> error : `, error);
  }
};

const updateRewardsById = async (_id, title, description, price) => {
  try {
    return await Rewards.updateOne(
      { _id },
      {
        $set: {
          title,
          description,
          price
        }
      }
    );
  } catch (error) {
    logger.error(`updateRewardsById() -> error : `, error);
  }
};

const deleteRewardsById = async (_id) => {
  try {
    return await Rewards.updateOne({ _id }, { $set: { deleted: true } });
  } catch (error) {
    logger.error(`deleteRewardsById() -> error : `, error);
  }
};

const addDefaultRewardsForTeam = async (teamId) => {
  try {
    return await Rewards.insertMany(
      DefaultRewards.map((reward) => ({ ...reward, teamId }))
    );
  } catch (error) {
    logger.error(`addDefaultRewardsForTeam() -> error : `, error);
  }
};

module.exports = {
  getRewardsByTeamId,
  getRewardById,
  addRewards,
  updateRewardsById,
  deleteRewardsById,
  addDefaultRewardsForTeam
};
