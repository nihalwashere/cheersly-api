const mongoose = require("mongoose");
const pMap = require("p-map");
const UserModel = require("../mongo/models/User");
const { MONGO_URL, MONGO_OPTIONS } = require("../global/config");
const { getAllAuths } = require("../mongo/helper/auth");
const {
  getTrialSubscriptionForSlackTeam,
} = require("../mongo/helper/subscriptions");
const { slackPostMessageToChannel } = require("../slack/api");
const { waitForMilliSeconds } = require("../utils/common");
const logger = require("../global/logger");

const createTemplate = (user, days) => {
  const dayOrDays = days > 1 ? "days" : "day";

  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:wave: *Hey there <@${user}>!* Your *Cheersly* trial is about to end in ${days} ${dayOrDays}. Upgrade your subscription now so that you can continue sharing cheers with your peers!`,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "Want to upgrade? contact support@cheersly.club",
        },
      ],
    },
  ];
};

const service = async () => {
  try {
    logger.info("UPGRADE TRIAL SUBSCRIPTION REMINDER CRON SERVICE");

    const auths = await getAllAuths();

    const handler = async auth => {
      const {
        slackInstallation: {
          authed_user: { id: authed_user_id },
          team: { id: teamId },
        },
      } = auth;

      const subscription = await getTrialSubscriptionForSlackTeam(teamId);

      if (!subscription) {
        return;
      }

      const now = new Date();

      const { expiresOn } = subscription;

      if (new Date(expiresOn) > new Date(now)) {
        let days = 0;

        if (new Date(expiresOn).getDate() - new Date(now).getDate() === 3) {
          days = 3;
        }

        if (new Date(expiresOn).getDate() - new Date(now).getDate() === 2) {
          days = 2;
        }

        if (new Date(expiresOn).getDate() - new Date(now).getDate() === 1) {
          days = 1;
        }

        if (days) {
          const users = [authed_user_id];

          const admins = await UserModel.find({
            "slackUserData.is_admin": true,
            "slackUserData.team_id": teamId,
            slackDeleted: false,
          });

          admins.forEach(admin => {
            if (!users.includes(admin.slackUserData.id)) {
              users.push(admin.slackUserData.id);
            }
          });

          for (let i = 0; i < users.length; i++) {
            await slackPostMessageToChannel(
              users[i],
              teamId,
              createTemplate(users[i], days)
            );

            await waitForMilliSeconds(1000);
          }
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
  ...MONGO_OPTIONS,
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
mongoose.connection.on("error", error => {
  logger.error(
    "Database error from upgrade trial subscription cron service -> error : ",
    error
  );
});
