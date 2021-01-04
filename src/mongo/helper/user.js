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

const getUserDataBySlackUserId = async (slackUserId) => {
  try {
    return await User.findOne({
      "slackUserData.id": slackUserId,
      slackDeleted: false
    });
  } catch (error) {
    logger.error(
      `getUserDataBySlackUserId() -> Failed to find slack user data for slack userId : ${slackUserId} -> `,
      error
    );
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

const updateAppHomePublishedForUser = async (slackUserId, trueOrFalse) => {
  try {
    return await User.updateOne(
      {
        "slackUserData.id": slackUserId
      },
      { $set: { appHomePublished: trueOrFalse } }
    );
  } catch (error) {
    logger.error(
      `updateAppHomePublishedForUser() : Failed to update app home published for slack user : ${slackUserId} -> error : `,
      error
    );
  }
};

const updateAppHomePublishedForTeam = async (teamId, trueOrFalse) => {
  try {
    return await User.updateMany(
      {
        "slackUserData.team_id": teamId
      },
      { $set: { appHomePublished: trueOrFalse } }
    );
  } catch (error) {
    logger.error(
      `updateAppHomePublishedForTeam() : Failed to update app home published for teamId : ${teamId} -> error : `,
      error
    );
  }
};

module.exports = {
  addUsersBatch,
  getUsersForTeam,
  getUserDataBySlackUserId,
  deleteSlackUsersByTeamId,
  updateAppHomePublishedForUser,
  updateAppHomePublishedForTeam
};
