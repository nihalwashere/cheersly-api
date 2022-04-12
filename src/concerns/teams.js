const AuthModel = require("../mongo/models/Auth");
const UserModel = require("../mongo/models/User");
const SettingsModel = require("../mongo/models/Settings");
const logger = require("../global/logger");

const createDefaultSettings = async (teamId, authedUserId) => {
  try {
    const user = await UserModel.findOne({
      "slackUserData.id": authedUserId,
      "slackUserData.team_id": teamId,
    });

    await new SettingsModel({
      teamId,
      isActivated: false,
      admins: [user._id],
      allowanceReloaded: true,
      pointsAboutToExpire: true,
      inactivityReminders: true,
      pointsAvailableToRedeem: true,
      requireCompanyValues: false,
      enableSharingGiphys: true,
      enableGiftCards: false,
    }).save();
  } catch (error) {
    logger.error("createDefaultSettings() -> error : ", error);
  }
};

const isAppEnabledForTeam = async teamId => {
  try {
    const auth = await AuthModel.findOne({
      "slackInstallation.team.id": teamId,
    });

    return auth.appEnabled;
  } catch (error) {
    logger.error("isAppEnabledForTeam() -> error : ", error);
  }
};

module.exports = { createDefaultSettings, isAppEnabledForTeam };
