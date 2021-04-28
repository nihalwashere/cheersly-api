const mongoose = require("mongoose");
const pMap = require("p-map");
const { MONGO_URL, MONGO_OPTIONS } = require("../../global/config");
const { getAllAuths } = require("../../mongo/helper/auth");
const {
  getTrialSubscriptionForSlackTeam
} = require("../../mongo/helper/subscriptions");
const { postMessageToHook } = require("../../slack/api");
const {
  createUpgradeTrialSubscriptionReminderTemplate
} = require("./template");
const { waitForMilliSeconds } = require("../../utils/common");
const logger = require("../../global/logger");

const service = async () => {
  try {
    logger.info("UPGRADE TRIAL SUBSCRIPTION REMINDER CRON SERVICE");

    const auths = await getAllAuths();

    const handler = async (auth) => {
      const {
        slackInstallation: {
          team: { id: teamId }
        }
      } = auth;

      const subscription = await getTrialSubscriptionForSlackTeam(teamId);

      if (!subscription || !subscription.isTrialPeriod) {
        return;
      }

      const now = new Date();

      const { ultimateDueDate } = subscription;

      if (new Date(ultimateDueDate) > new Date(now)) {
        let days = 0;

        if (
          new Date(ultimateDueDate).getDate() - new Date(now).getDate() ===
          3
        ) {
          days = 3;
        }

        if (
          new Date(ultimateDueDate).getDate() - new Date(now).getDate() ===
          2
        ) {
          days = 2;
        }

        if (
          new Date(ultimateDueDate).getDate() - new Date(now).getDate() ===
          1
        ) {
          days = 1;
        }

        if (days) {
          await postMessageToHook(
            teamId,
            createUpgradeTrialSubscriptionReminderTemplate(days)
          );

          await waitForMilliSeconds(1000);
        }
      }
    };

    await pMap(auths, handler, { concurrency: 1 });
  } catch (error) {
    logger.error(
      "UPGRADE TRIAL SUBSCRIPTION REMINDER CRON SERVICE FAILED -> error : ",
      error
    );
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
    logger.info(
      "Connected to database from upgrade trial subscription cron service"
    );

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
    "Database error from upgrade trial subscription cron service -> error : ",
    error
  );
});
