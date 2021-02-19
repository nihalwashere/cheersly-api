const mongoose = require("mongoose");
const pMap = require("p-map");
const R = require("ramda");
const { MONGO_URL, MONGO_OPTIONS } = require("../../global/config");
const { getAllAuths } = require("../../mongo/helper/auth");
const {
  getUsersForTeam,
  getUserDataBySlackUserName
} = require("../../mongo/helper/user");
const { getCheersStatsForUser } = require("../../mongo/helper/cheersStats");
const { postMessageToHook } = require("../../slack/api");
const { sortLeaders } = require("../../utils/common");
const logger = require("../../global/logger");

const getUniqueUsers = R.uniq(R.prop("to"));

const service = async () => {
  try {
    logger.info("STARTING WEEKLY STATS CRON SERVICE");

    const auths = await getAllAuths();

    const handler = async (auth) => {
      const {
        slackInstallation: {
          team: { id: teamId }
        }
      } = auth;

      const leaders = [];

      const users = await getUsersForTeam(teamId);

      await Promise.all(
        users.map(async (user) => {
          const {
            slackUserData: { name: slackUserName }
          } = user;

          const cheersStats = await getCheersStatsForUser(
            teamId,
            slackUserName
          );

          if (cheersStats) {
            leaders.push({
              slackUserName,
              cheersReceived: cheersStats.cheersReceived
            });
          }
        })
      );

      const sortedLeaders = sortLeaders(leaders);

      logger.debug("sortedLeaders : ", sortedLeaders);

      if (sortedLeaders && sortedLeaders.length && sortedLeaders.length === 0) {
        // no cheers receivers for this week
      }

      if (sortedLeaders && sortedLeaders.length && sortedLeaders.length > 3) {
        // consider only top 3
      }

      if (
        sortedLeaders &&
        sortedLeaders.length &&
        sortedLeaders.length > 0 &&
        sortedLeaders.length < 3
      ) {
        // consider exact count
      }

      await postMessageToHook(teamId, []);
    };

    await pMap(auths, handler, { concurrency: 1 });
  } catch (error) {
    logger.error("WEEKLY STATS CRON SERVICE FAILED -> error : ", error);
  }
};

// Connect To Database
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL, {
  keepAlive: true,
  ...MONGO_OPTIONS
});

// On Connection
mongoose.connection.on("connected", async () => {
  try {
    logger.info("Connected to database from weekly stats cron service");

    // execute service
    await service();

    mongoose.disconnect();
  } catch (error) {
    logger.error(error);
    mongoose.disconnect();
  }
});

// On Error
mongoose.connection.on("error", (error) => {
  logger.error(
    "Database error from weekly stats cron service -> error : ",
    error
  );
});
