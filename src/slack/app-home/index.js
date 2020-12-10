const AppHomeCommonBlocks = require("../../mongo/models/AppHomeCommonBlocks");
const CheersStats = require("../../mongo/models/CheersStats");
const logger = require("../../global/logger");
const { publishView } = require("../api");
const { createAppHomeTemplate } = require("./template");

const publishStats = async (teamId, slackUserId) => {
  try {
    const cheersStatsForUser = await CheersStats.findOne({
      teamId,
      slackUserId
    });

    let cheersGiven = 0,
      cheersReceived = 0;

    if (cheersStatsForUser) {
      cheersGiven = cheersStatsForUser.cheersGiven;
      cheersReceived = cheersStatsForUser.cheersReceived;
    }

    const appHomeCommonBlocks = await AppHomeCommonBlocks.findOne({ teamId });

    const appHomeTemplate = createAppHomeTemplate(
      cheersGiven,
      cheersReceived,
      appHomeCommonBlocks
    );

    await publishView(teamId, slackUserId, appHomeTemplate);
  } catch (error) {
    logger.error("publishAppHome() -> error : ", error);
  }
};

module.exports = { publishStats };
