const mongoose = require("mongoose");
const pMap = require("p-map");
const AuthModel = require("../mongo/models/Auth");
const UserModel = require("../mongo/models/User");
const SubscriptionsModel = require("../mongo/models/Subscriptions");
const { MONGO_URL, MONGO_OPTIONS } = require("../global/config");
const { waitForMilliSeconds } = require("../utils/common");
const { slackPostMessageToChannel } = require("../slack/api");
const logger = require("../global/logger");

const createTemplate = user => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `:wave: *Hey there <@${user}>!* Your *Cheersly* trial has ended. Upgrade your subscription now so that you can continue sharing cheers with your peers!`,
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        "You are also eligible for a *20% discount for the first month*. Just contact support@cheersly.club and we'll set you up.",
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

const service = async () => {
  try {
    logger.info("UPGRADE TRIAL WITH OFFER CRON SERVICE");

    const auths = await AuthModel.find({ slackDeleted: false });

    const handler = async auth => {
      const {
        slackInstallation: {
          authed_user: { id: authed_user_id },
          team: { id: teamId },
        },
      } = auth;

      const subscription = await SubscriptionsModel.findOne({
        slackTeamId: teamId,
        isTrialPeriod: true,
      });

      if (
        !subscription ||
        (subscription && new Date(subscription.nextDueDate) >= new Date()) ||
        (subscription &&
          new Date().getDate() - new Date(subscription.nextDueDate).getDate() <
            7)
      ) {
        return;
      }

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
          createTemplate(users[i])
        );

        await waitForMilliSeconds(1000);
      }
    };

    await pMap(auths, handler, { concurrency: 1 });
  } catch (error) {
    logger.error(
      "UPGRADE TRIAL WITH OFFER CRON SERVICE FAILED -> error : ",
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
      "Connected to database from upgrade trial with offer cron service"
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
    "Database error from upgrade trial with offer cron service -> error : ",
    error
  );
});
