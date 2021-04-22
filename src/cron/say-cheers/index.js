const mongoose = require("mongoose");
const pMap = require("p-map");
const { MONGO_URL, MONGO_OPTIONS } = require("../../global/config");
const { getAllAuths } = require("../../mongo/helper/auth");
const { getUsersForTeam } = require("../../mongo/helper/user");
const { slackPostMessageToChannel } = require("../../slack/api");
const { createSayCheersTemplate } = require("./template");
const { waitForMilliSeconds } = require("../../utils/common");
const logger = require("../../global/logger");

const service = async () => {
  try {
    logger.info("SAY CHEERS CRON SERVICE");

    const auths = await getAllAuths();

    const handler = async (auth) => {
      const {
        slackInstallation: {
          team: { id: teamId }
        }
      } = auth;

      const users = await getUsersForTeam(teamId);

      for (let i = 0; i < users.length; i++) {
        const {
          slackUserData: { id: slackUserId }
        } = users[i];

        await slackPostMessageToChannel(
          slackUserId,
          teamId,
          createSayCheersTemplate()
        );

        await waitForMilliSeconds(1000);
      }
    };

    await pMap(auths, handler, { concurrency: 1 });
  } catch (error) {
    logger.error("SAY CHEERS CRON SERVICE FAILED -> error : ", error);
  }
};

// Connect To Database
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL, {
  ...MONGO_OPTIONS
});

// On Connection
mongoose.connection.on("connected", async () => {
  try {
    logger.info("Connected to database from say cheers cron service");

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
    "Database error from say cheers cron service -> error : ",
    error
  );
});
