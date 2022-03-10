const mongoose = require("mongoose");
const pMap = require("p-map");
const AuthModel = require("../mongo/models/Auth");
const SubscriptionsModel = require("../mongo/models/Subscriptions");
const { MONGO_URL, MONGO_OPTIONS } = require("../global/config");
const {
  SLACK_ACTIONS: { INTRODUCE_TO_TEAM },
} = require("../global/constants");
const { waitForMilliSeconds } = require("../utils/common");
const { slackPostMessageToChannel } = require("../slack/api");
const { createSupportContextTemplate } = require("../slack/templates");
const logger = require("../global/logger");

const createTemplate = user => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:wave: *Hey there <@${user}>!*`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "It seems like you haven't introduced me to your team yet. Well, I would like to make new friends and I am better when I have more people around me!",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Introduce *Cheersly* to the team!",
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "Introduce to team",
          emoji: true,
        },
        action_id: INTRODUCE_TO_TEAM,
      },
    },
    createSupportContextTemplate(),
  ];
};

const service = async () => {
  try {
    logger.info("INTRODUCE TO TEAM REMINDER CRON SERVICE");

    const auths = await AuthModel.find({ slackDeleted: false });

    const handler = async auth => {
      const {
        slackInstallation: {
          authed_user: { id: authed_user_id },
          team: { id: teamId },
        },
        appIntroducedToTeam = false,
      } = auth;

      if (appIntroducedToTeam) {
        return;
      }

      const subscription = await SubscriptionsModel.findOne({
        slackTeamId: teamId,
        isTrialPeriod: true,
      });

      if (
        !subscription ||
        (subscription && new Date(subscription.nextDueDate) <= new Date())
      ) {
        return;
      }

      await slackPostMessageToChannel(
        authed_user_id,
        teamId,
        createTemplate(authed_user_id)
      );

      await AuthModel.findOneAndUpdate(
        { "slackInstallation.team.id": teamId },
        {
          appIntroducedToTeam: true,
        }
      );

      await waitForMilliSeconds(1000);
    };

    await pMap(auths, handler, { concurrency: 1 });
  } catch (error) {
    logger.error(
      "INTRODUCE TO TEAM REMINDER CRON SERVICE FAILED -> error : ",
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
    logger.info("Connected to database from introduce to team cron service");

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
    "Database error from introduce to team cron service -> error : ",
    error
  );
});
