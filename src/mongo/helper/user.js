const User = require("../models/User");
const logger = require("../../global/logger");

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

module.exports = { deleteSlackUsersByTeamId };
