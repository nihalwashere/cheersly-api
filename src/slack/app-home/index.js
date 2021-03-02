const logger = require("../../global/logger");
const { getAppHpmeBlocksForTeam } = require("../../mongo/helper/appHomeBlocks");
const { getCheersStatsForUser } = require("../../mongo/helper/cheersStats");
const { publishView } = require("../api");
const { createAppHomeTemplate } = require("./template");
const { APP_NAME } = require("../../global/config");
const { PROD_APP_URL, DEV_APP_URL } = require("../../global/constants");

const publishStats = async (teamId, slackUserId, slackUsername = null) => {
  try {
    let cheersGiven = 0,
      cheersReceived = 0;

    if (slackUsername) {
      const cheersStatsForUser = await getCheersStatsForUser(
        teamId,
        slackUsername
      );

      if (cheersStatsForUser) {
        cheersGiven = cheersStatsForUser.cheersGiven;
        cheersReceived = cheersStatsForUser.cheersReceived;
      }
    }

    const appHomeBlocks = await getAppHpmeBlocksForTeam(teamId);

    const url = String(APP_NAME).includes("-dev") ? DEV_APP_URL : PROD_APP_URL;

    const appHomeTemplate = createAppHomeTemplate(
      url,
      cheersGiven,
      cheersReceived,
      appHomeBlocks
    );

    await publishView(teamId, slackUserId, appHomeTemplate);
  } catch (error) {
    logger.error("publishAppHome() -> error : ", error);
  }
};

module.exports = { publishStats };
