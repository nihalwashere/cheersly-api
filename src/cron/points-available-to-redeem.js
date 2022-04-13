const mongoose = require("mongoose");
const pMap = require("p-map");
const { MONGO_URL, MONGO_OPTIONS } = require("../global/config");
const AuthModel = require("../mongo/models/Auth");
const UsersModel = require("../mongo/models/User");
const SubscriptionsModel = require("../mongo/models/Subscriptions");
const { slackPostMessageToChannel } = require("../slack/api");
const { waitForMilliSeconds, getAppUrl } = require("../utils/common");
const { getCheersStatsForUser } = require("../concerns/cheers");
const logger = require("../global/logger");

const createTemplate = (userId, points) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `:wave: Hey, <@${userId}>! It's time for some shopping! You have points that can be reedemed for gift cards from popular retailers around the world.`,
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `Total \`${points} points\` reedemable.`,
    },
    accessory: {
      type: "button",
      text: {
        type: "plain_text",
        text: ":moneybag: Redeem now",
        emoji: true,
      },
      url: `${getAppUrl()}/redeem`,
    },
  },
  {
    type: "divider",
  },
  {
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: ":bell: Manage nudges",
          emoji: true,
        },
        url: `${getAppUrl()}/settings`,
      },
    ],
  },
];

const service = async () => {
  try {
    logger.info("POINTS AVAILABLE TO REDEEM CRON SERVICE STARTED");

    const auths = await AuthModel.find({
      slackDeleted: false,
    });

    const handler = async auth => {
      const {
        slackInstallation: {
          team: { id: teamId },
        },
      } = auth;

      const subscription = await SubscriptionsModel.findOne({
        slackTeamId: teamId,
      });

      if (!subscription) {
        return;
      }

      const users = await UsersModel.find({
        "slackUserData.team_id": teamId,
        slackDeleted: false,
      });

      for (let i = 0; i < users.length; i += 1) {
        const {
          slackUserData: { id: slackUserId },
        } = users[i];

        const { cheersRedeemable } = await getCheersStatsForUser(
          teamId,
          slackUserId
        );

        await slackPostMessageToChannel(
          slackUserId,
          teamId,
          createTemplate(slackUserId, cheersRedeemable)
        );

        await waitForMilliSeconds(200);
      }
    };

    await pMap(auths, handler, { concurrency: 1 });
  } catch (error) {
    logger.error(
      "POINTS AVAILABLE TO REDEEM CRON SERVICE STARTED FAILED -> error : ",
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
      "CONNECTED TO DATABASE FROM POINTS AVAILABLE TO REDEEM CRON SERVICE"
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
    "DATABASE ERROR FROM POINTS AVAILABLE TO REDEEM CRON SERVICE -> error : ",
    error
  );
});
