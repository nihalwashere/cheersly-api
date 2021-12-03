const mongoose = require("mongoose");
const pMap = require("p-map");
const { MONGO_URL, MONGO_OPTIONS } = require("../global/config");
const { slackPostMessageToChannel } = require("../slack/api");
const { createAdminOnboardingMessageTemplate } = require("../slack/templates");
const { waitForMilliSeconds, getAppUrl } = require("../utils/common");
const AuthModel = require("../mongo/models/Auth");
const UserModel = require("../mongo/models/User");
const { UserRoles } = require("../enums/userRoles");
const logger = require("../global/logger");

const service = async () => {
  try {
    logger.info("STARTING ADMIN ONBOARDING CRON SERVICE");

    const auths = await AuthModel.find({
      slackDeleted: false,
      adminOnboardingDone: false,
    });

    const handler = async auth => {
      if (
        !(new Date().getDate() - new Date(auth.createdAt).getDate() > 3) &&
        auth.adminOnboardingDone
      ) {
        return;
      }

      const {
        slackInstallation: {
          authed_user: { id: authed_user_id },
          team: { id: team_id },
        },
      } = auth;

      const users = [authed_user_id];

      const admins = await UserModel.find({
        "slackUserData.team_id": team_id,
        role: UserRoles.ADMIN,
        slackDeleted: false,
      });

      admins.map(admin => {
        if (!users.includes(admin.slackUserData.id)) {
          users.push(admin.slackUserData.id);
        }
      });

      for (let i = 0; i < users.length; i += 1) {
        await slackPostMessageToChannel(
          users[i],
          team_id,
          createAdminOnboardingMessageTemplate(getAppUrl(), team_id)
        );

        await waitForMilliSeconds(1000);
      }

      await AuthModel.updateOne(
        { "slackInstallation.team.id": team_id },
        { $set: { adminOnboardingDone: true } }
      );
    };

    await pMap(auths, handler, { concurrency: 1 });
  } catch (error) {
    logger.error("ADMIN ONBOARDING CRON SERVICE FAILED -> error : ", error);
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
    logger.info("Connected to database from admin onboarding cron service");

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
    "Database error from admin onboarding cron service -> error : ",
    error
  );
});
