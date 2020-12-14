const AppHomeBlocks = require("../../mongo/models/AppHomeBlocks");
const CheersStats = require("../../mongo/models/CheersStats");
const logger = require("../../global/logger");
const { publishView } = require("../api");
const { createAppHomeTemplate } = require("./template");

const publishStats = async (teamId, slackUserId, slackUsername = null) => {
  try {
    let cheersGiven = 0,
      cheersReceived = 0;

    if (slackUsername) {
      const cheersStatsForUser = await CheersStats.findOne({
        teamId,
        slackUsername
      });

      if (cheersStatsForUser) {
        cheersGiven = cheersStatsForUser.cheersGiven;
        cheersReceived = cheersStatsForUser.cheersReceived;
      }
    }

    const appHomeBlocks = await AppHomeBlocks.findOne({ teamId });

    const appHomeTemplate = createAppHomeTemplate(
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
