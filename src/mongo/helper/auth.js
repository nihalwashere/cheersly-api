const Auth = require("../models/Auth");
const logger = require("../../global/logger");

const addAuth = async (payload) => {
  try {
    return await new Auth(payload).save();
  } catch (error) {
    logger.error("addAuth() -> error : ", error);
  }
};

const getAllAuths = async () => {
  try {
    return await Auth.find({ slackDeleted: false });
  } catch (error) {
    logger.error("getAllAuths() -> error : ", error);
  }
};

const updateAuth = async (teamId, payload) => {
  try {
    return await Auth.updateOne(
      { "slackInstallation.team.id": teamId },
      { $set: { slackInstallation: payload } }
    );
  } catch (error) {
    logger.error("updateAuth() -> error : ", error);
  }
};

const upsertAuth = async (teamId, payload) => {
  try {
    return await Auth.findOneAndUpdate(
      { teamId },
      { slackInstallation: payload },
      { new: true, upsert: true }
    );
  } catch (error) {
    logger.error("upsertAuth() -> error : ", error);
  }
};

const getAuthDataForSlackTeam = async (teamId) => {
  try {
    return await Auth.findOne({
      "slackInstallation.team.id": teamId,
      slackDeleted: false
    });
  } catch (error) {
    logger.error(
      `getAuthDataForSlackTeam() : Failed to find auth data for teamId : ${teamId} -> error : `,
      error
    );
  }
};

const getAuthDeletedOrNotDeleted = async (teamId) => {
  try {
    return await Auth.findOne({
      "slackInstallation.team.id": teamId
    });
  } catch (error) {
    logger.error(`getAuthDeletedOrNotDeleted() -> error : `, error);
  }
};

const getSlackBotTokenForTeam = async (team_id) => {
  try {
    const auth = await getAuthDataForSlackTeam(team_id);

    if (auth) {
      const {
        slackInstallation: { access_token: bot_access_token }
      } = auth;

      return bot_access_token;
    }

    return null;
  } catch (error) {
    logger.error(
      `getSlackBotTokenForTeam() : Failed to fetch auth info for team : ${team_id} -> error : `,
      error
    );
  }
};

const deleteSlackAuthByTeamId = async (teamId) => {
  try {
    await Auth.updateMany(
      { "slackInstallation.team.id": teamId },
      { $set: { slackDeleted: true } }
    );
  } catch (error) {
    logger.error(
      `deleteSlackAuthByTeamId() -> Failed to delete slack auth for slack teamId : ${teamId} -> `,
      error
    );
  }
};

module.exports = {
  addAuth,
  getAllAuths,
  updateAuth,
  upsertAuth,
  getAuthDataForSlackTeam,
  getSlackBotTokenForTeam,
  deleteSlackAuthByTeamId,
  getAuthDeletedOrNotDeleted
};
