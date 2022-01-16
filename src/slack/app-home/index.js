const logger = require("../../global/logger");
const { getAppHpmeBlocksForTeam } = require("../../mongo/helper/appHomeBlocks");
const { getCheersStatsForUser } = require("../../mongo/helper/cheersStats");
const { publishView } = require("../api");
const {
  createAppHomeTemplate,
  createSubscriptionStatsTemplate,
} = require("./template");
const { getAppUrl } = require("../../utils/common");

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

    const appHomeBlocks = await getAppHpmeBlocksForTeam(teamId);

    const appHomeTemplate = createAppHomeTemplate({
      appUrl: getAppUrl(),
      cheersGiven,
      cheersReceived,
      cheersRedeemable,
      appHomeBlocks,
      isSubscriptionExpired,
      isTrialPlan,
    });

    await publishView(teamId, slackUserId, appHomeTemplate);
  } catch (error) {
    logger.error("publishAppHome() -> error : ", error);
  }
};

const publishSubscriptionStats = async (
  teamId,
  slackUserId,
  slackUsername = null
) => {
  try {
    const appHomeBlocks = await getAppHpmeBlocksForTeam(teamId);

    await publishView(
      teamId,
      slackUserId,
      createSubscriptionStatsTemplate({
        appUrl: getAppUrl(),
        appHomeBlocks,
      })
    );
  } catch (error) {
    logger.error("publishSubscriptionStats() -> error : ", error);
  }
};

module.exports = { publishStats, publishSubscriptionStats };
