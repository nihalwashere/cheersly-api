const User = require("../models/User");
const logger = require("../../global/logger");

const addUsersBatch = async (batch) => {
  try {
    return await User.insertMany(batch);
  } catch (error) {
    logger.error("addUsersBatch() -> error : ", error);
  }
};

const getUsersForTeam = async (teamId) => {
  try {
    return await User.find({ "slackUserData.team_id": teamId });
  } catch (error) {
    logger.error("getUsersForTeam() -> error : ", error);
  }
};

const deleteSlackUsersByTeamId = async (teamId) => {
  try {
    return await User.updateMany(
      { "slackUserData.team_id": teamId },
      { $set: { slackDeleted: true } }
    );
  } catch (error) {
    logger.error(
      `deleteSlackUsersByTeamId() : Failed to delete slack users for teamId : ${teamId} -> `,
      error
    );
  }
};

module.exports = { addUsersBatch, getUsersForTeam, deleteSlackUsersByTeamId };
