const { publishView } = require("../api");
const { createAppHomeTemplate } = require("./template");
const { getAppUrl } = require("../../utils/common");
const {
  getCheersStatsForUser,
  getCurrentMonthStatsForUser,
} = require("../../concerns/cheers");
const logger = require("../../global/logger");

const publishAppHome = async ({
  teamId,
  slackUserId,
  isSubscriptionExpired = false,
  isTrialPlan = true,
}) => {
  try {
    const {
      cheersGiven,
      cheersReceived,
      cheersRedeemable,
    } = await getCheersStatsForUser(teamId, slackUserId);

    const {
      totalPointAllowance,
      totalSpentThisMonth,
      totalPointsRemaining,
    } = await getCurrentMonthStatsForUser(teamId, slackUserId);

    const appHomeTemplate = createAppHomeTemplate({
      slackUserId,
      appUrl: getAppUrl(),
      cheersGiven,
      cheersReceived,
      cheersRedeemable,
      totalPointAllowance,
      totalSpentThisMonth,
      totalPointsRemaining,
      isSubscriptionExpired,
      isTrialPlan,
    });

    await publishView(teamId, slackUserId, appHomeTemplate);
  } catch (error) {
    logger.error("publishAppHome() -> error : ", error);
  }
};

module.exports = { publishAppHome };
