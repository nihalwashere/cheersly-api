const mongoose = require("mongoose");
const pMap = require("p-map");
const moment = require("moment-timezone");
const { MONGO_URL, MONGO_OPTIONS } = require("../global/config");
const AuthModel = require("../mongo/models/Auth");
const UsersModel = require("../mongo/models/User");
const SubscriptionsModel = require("../mongo/models/Subscriptions");
const { slackPostMessageToChannel } = require("../slack/api");
const {
  waitForMilliSeconds,
  getChannelString,
  getAppUrl,
} = require("../utils/common");
const { getCurrentMonthStatsForUser } = require("../concerns/cheers");
const logger = require("../global/logger");

const createTemplate = (userId, month, points, channelString) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `:wave: Hey, <@${userId}>! Your point allowance for ${month} has been reset.`,
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `Total \`${points} points\` available this month.`,
    },
  },
  {
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: `Use \`/cheers\` in ${channelString} to recognize your peers`,
      },
    ],
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
    logger.info("ALLOWANCE RELOADED CRON SERVICE STARTED");

    const auths = await AuthModel.find({
      slackDeleted: false,
    });

    const month = moment()
      .startOf("month")
      .format("MMMM");

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

        const {
          totalPointAllowance,
          recognitionTeamsForUser,
        } = await getCurrentMonthStatsForUser(teamId, slackUserId);

        await slackPostMessageToChannel(
          slackUserId,
          teamId,
          createTemplate(
            slackUserId,
            month,
            totalPointAllowance,
            getChannelString(teamId, recognitionTeamsForUser)
          )
        );

        await waitForMilliSeconds(200);
      }
    };

    await pMap(auths, handler, { concurrency: 1 });
  } catch (error) {
    logger.error(
      "ALLOWANCE RELOADED CRON SERVICE STARTED FAILED -> error : ",
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
    logger.info("CONNECTED TO DATABASE FROM ALLOWANCE RELOADED CRON SERVICE");

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
    "DATABASE ERROR FROM ALLOWANCE RELOADED CRON SERVICE -> error : ",
    error
  );
});
