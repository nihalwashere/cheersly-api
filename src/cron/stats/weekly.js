const mongoose = require("mongoose");
const pMap = require("p-map");
const moment = require("moment-timezone");
const { MONGO_URL, MONGO_OPTIONS } = require("../../global/config");
const { getAllAuths } = require("../../mongo/helper/auth");
const { getCheersForTeam } = require("../../mongo/helper/cheers");
const { postMessageToHook } = require("../../slack/api");
const { processTopCheersReceivers } = require("../../utils/common");
const { createStatsTemplate } = require("./template");
const logger = require("../../global/logger");

const service = async () => {
  try {
    logger.info("STARTING WEEKLY STATS CRON SERVICE");

    const auths = await getAllAuths();

    const handler = async auth => {
      const {
        slackInstallation: {
          team: { id: teamId },
        },
      } = auth;

      const fromDate = moment()
        .subtract(7, "day")
        .startOf("day")
        .toDate();
      const toDate = moment()
        .startOf("day")
        .toDate();

      // get cheers for past week
      const cheers = await getCheersForTeam(teamId, fromDate, toDate);

      const topCheersReceivers = processTopCheersReceivers(cheers);

      logger.debug("topCheersReceivers : ", topCheersReceivers);

      await postMessageToHook(
        teamId,
        createStatsTemplate(topCheersReceivers, fromDate, toDate)
      );
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
  ...MONGO_OPTIONS,
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
mongoose.connection.on("error", error => {
  logger.error(
    "Database error from weekly stats cron service -> error : ",
    error
  );
});
