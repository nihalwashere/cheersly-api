const Auth = require("../models/Auth");
const logger = require("../../global/logger");

const getAuthDataForSlackTeam = async (teamId) => {
  try {
    return await Auth.findOne({
      "slackInstallation.team.id": teamId,
      slackDeleted: false,
    });
  } catch (error) {
    logger.error(
      `getAuthDataForSlackTeam() : Failed to find auth data for teamId : ${teamId} -> error : `,
      error
    );
  }
};

const getSlackBotTokenForTeam = async (team_id) => {
  try {
    const auth = await getAuthDataForSlackTeam(team_id);

    if (auth) {
      const {
        slackInstallation: { access_token: bot_access_token },
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
  getAuthDataForSlackTeam,
  getSlackBotTokenForTeam,
  deleteSlackAuthByTeamId,
};
