const moment = require("moment-timezone");
const RecognitionTeamsModel = require("../mongo/models/RecognitionTeams");
const UserModel = require("../mongo/models/User");
const CheersModel = require("../mongo/models/Cheers");
const logger = require("../global/logger");

const getCurrentMonthStatsForUser = async (teamId, slackUserId) => {
  try {
    const user = await UserModel.findOne({
      "slackUserData.team_id": teamId,
      "slackUserData.id": slackUserId,
    });

    const recognitionTeamsForUser = await RecognitionTeamsModel.find({
      teamId,
      members: { $in: [user._id] },
    });

    let totalPointAllowance = 0;

    recognitionTeamsForUser.forEach(elem => {
      totalPointAllowance += Number(elem.pointAllowance);
    });

    const cheersForThisMonth = await CheersModel.find({
      teamId,
      from: slackUserId,
      createdAt: {
        $gte: moment()
          .startOf("month")
          .toDate(),
        $lte: new Date(),
      },
    });

    let totalSpentThisMonth = 0;

    cheersForThisMonth.forEach(elem => {
      totalSpentThisMonth += Number(elem.points);
    });

    return {
      totalPointAllowance,
      totalSpentThisMonth,
    };
  } catch (error) {
    logger.error("getCurrentMonthStatsForUser() -> ", error);
  }
};

module.exports = { getCurrentMonthStatsForUser };
