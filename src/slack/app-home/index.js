const { getCheersStatsForUser } = require("../../mongo/helper/cheersStats");
const { publishView } = require("../api");
const { createAppHomeTemplate } = require("./template");
const { getAppUrl } = require("../../utils/common");
const { getCurrentMonthStatsForUser } = require("../../concerns/cheers");
const logger = require("../../global/logger");

const publishStats = async ({
  teamId,
  slackUserId,
  slackUsername = null,
  isSubscriptionExpired = false,
  isTrialPlan = true,
}) => {
  try {
    let cheersGiven = 0,
      cheersReceived = 0,
      cheersRedeemable = 0;

    if (slackUsername) {
      const cheersStatsForUser = await getCheersStatsForUser(
        teamId,
        slackUsername
      );

      if (cheersStatsForUser) {
        cheersGiven = cheersStatsForUser.cheersGiven;
        cheersReceived = cheersStatsForUser.cheersReceived;
        cheersRedeemable = cheersStatsForUser.cheersRedeemable;
      }
    }

    const {
      totalPointAllowance,
      totalSpentThisMonth,
    } = await getCurrentMonthStatsForUser(teamId, slackUserId);

    const appHomeTemplate = createAppHomeTemplate({
      appUrl: getAppUrl(),
      cheersGiven,
      cheersReceived,
      cheersRedeemable,
      totalPointAllowance,
      totalSpentThisMonth,
      isSubscriptionExpired,
      isTrialPlan,
    });

    await publishView(teamId, slackUserId, appHomeTemplate);
  } catch (error) {
    logger.error("publishAppHome() -> error : ", error);
  }
};

module.exports = { publishStats };
