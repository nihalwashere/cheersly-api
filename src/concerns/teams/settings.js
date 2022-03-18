const UserModel = require("../../mongo/models/User");
const SettingsModel = require("../../mongo/models/Settings");
const logger = require("../../global/logger");

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
    }).save();
  } catch (error) {
    logger.error("createDefaultSettings() -> error : ", error);
  }
};

module.exports = { createDefaultSettings };
