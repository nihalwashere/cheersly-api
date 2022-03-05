const moment = require("moment-timezone");
const RecognitionTeamsModel = require("../mongo/models/RecognitionTeams");
const UserModel = require("../mongo/models/User");
const CheersModel = require("../mongo/models/Cheers");
const CheersStatsModel = require("../mongo/models/CheersStats");
const logger = require("../global/logger");

const getCheersStatsForUser = async (teamId, slackUserId) => {
  try {
    let cheersGiven = 0,
      cheersReceived = 0,
      cheersRedeemable = 0;

    const cheersStatsForUser = await CheersStatsModel.findOne({
      teamId,
      slackUserId,
    });

    if (cheersStatsForUser) {
      cheersGiven = cheersStatsForUser.cheersGiven;
      cheersReceived = cheersStatsForUser.cheersReceived;
      cheersRedeemable = cheersStatsForUser.cheersRedeemable;
    }

    return {
      cheersGiven,
      cheersReceived,
      cheersRedeemable,
    };
  } catch (error) {
    logger.error("getCheersStatsForUser() -> error : ", error);
  }
};

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

    const totalPointsRemaining = Number(
      totalPointAllowance - totalSpentThisMonth
    );

    return {
      totalPointAllowance,
      totalSpentThisMonth,
      totalPointsRemaining,
    };
  } catch (error) {
    logger.error("getCurrentMonthStatsForUser() -> error : ", error);
  }
};

const getCurrentMonthTotalSpentForUserByRecognitionTeam = async (
  teamId,
  slackUserId,
  recognitionTeamId
) => {
  try {
    const cheersForThisMonth = await CheersModel.find({
      teamId,
      recognitionTeamId,
      from: slackUserId,
      createdAt: {
        $gte: moment()
          .startOf("month")
          .toDate(),
        $lte: new Date(),
      },
    });

    let currentMonthTotalSpentForRecognitionTeam = 0;

    cheersForThisMonth.forEach(elem => {
      currentMonthTotalSpentForRecognitionTeam += Number(elem.points);
    });

    return {
      currentMonthTotalSpentForRecognitionTeam,
    };
  } catch (error) {
    logger.error(
      "getCurrentMonthTotalSpentForUserByRecognitionTeam() -> error : ",
      error
    );
  }
};

module.exports = {
  getCheersStatsForUser,
  getCurrentMonthStatsForUser,
  getCurrentMonthTotalSpentForUserByRecognitionTeam,
};
