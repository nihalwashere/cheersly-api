const User = require("../models/User");
const logger = require("../../global/logger");

const addUser = async (payload) => {
  try {
    return await new User(payload).save();
  } catch (error) {
    logger.error("addUser() -> error : ", error);
  }
};

const addUsersBatch = async (batch) => {
  try {
    return await User.insertMany(batch);
  } catch (error) {
    logger.error("addUsersBatch() -> error : ", error);
  }
};

const upsertUser = async (slackUserId, payload) => {
  try {
    return await User.findOneAndUpdate(
      { "slackUserData.id": slackUserId },
      { ...payload },
      { new: true, upsert: true }
    );
  } catch (error) {
    logger.error("upsertUser() -> error : ", error);
  }
};

const getUsersForTeam = async (teamId) => {
  try {
    return await User.find({
      "slackUserData.team_id": teamId,
      slackDeleted: false
    });
  } catch (error) {
    logger.error("getUsersForTeam() -> error : ", error);
  }
};

const getUserDataById = async (_id) => {
  try {
    return await User.findOne({
      _id,
      slackDeleted: false
    });
  } catch (error) {
    logger.error(`getUserDataById() -> error : `, error);
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

const getUserDataBySlackUserName = async (slackUserName) => {
  try {
    return await User.findOne({
      "slackUserData.name": slackUserName,
      slackDeleted: false
    });
  } catch (error) {
    logger.error(
      `getUserDataBySlackUserName() -> Failed to find slack user data for slack username : ${slackUserName} -> `,
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

const paginateUsersForTeam = async (teamId, pageIndex, pageSize) => {
  try {
    const totalCount = await User.find({
      "slackUserData.team_id": teamId
    }).countDocuments({});

    const data = await User.find({ "slackUserData.team_id": teamId })
      .sort({ createdAt: 1 })
      .skip(pageSize * pageIndex)
      .limit(pageSize);

    return {
      data,
      totalCount: Number(totalCount),
      totalPages: Math.ceil(totalCount / pageSize)
    };
  } catch (error) {
    logger.error(`paginateUsersForTeam() -> error : `, error);
  }
};

const updateRoleForUser = async (slackUserId, role) => {
  try {
    return await User.updateOne(
      {
        "slackUserData.id": slackUserId
      },
      { $set: { role } }
    );
  } catch (error) {
    logger.error(`updateRoleForUser() -> error : `, error);
  }
};

module.exports = {
  addUser,
  addUsersBatch,
  upsertUser,
  getUsersForTeam,
  getUserDataBySlackUserId,
  getUserDataBySlackUserName,
  deleteSlackUsersByTeamId,
  updateAppHomePublishedForUser,
  updateAppHomePublishedForTeam,
  paginateUsersForTeam,
  updateRoleForUser,
  getUserDataById
};
