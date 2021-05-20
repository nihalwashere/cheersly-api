require("dotenv").config();
const mongoose = require("mongoose");
const pMap = require("p-map");
const { getAllAuths } = require("../src/mongo/helper/auth");
const { postMessageToHook } = require("../src/slack/api");
const logger = require("../src/global/logger");

// const teamIds = ["TT4G2QY1W", "T01PE2U3AKG"]; // prod
// const teamIds = ["TUDG6C681"]; // prod internal
// const teamIds = ["T018LGG2CTY"]; // dev

const service = async () => {
  try {
    logger.info("STARTING NOTIFY CUSTOMERS SCRIPT");

    const auths = await getAllAuths();

    const handler = async (auth) => {
      const {
        slackInstallation: {
          team: { id: teamId }
        }
      } = auth;

      await postMessageToHook(teamId, [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "Hey there! :wave: \n\n This is to inform that we are taking *Cheersly* off from the Slack app directory and will be manually distributing it (not through the Slack app directory)."
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "*Why are we moving off from the Slack app directory?* \n Whenever we submit any changes to the app, we need the changes to get approved by the Slack team, this often takes too long which we cannot afford at the moment. We are moving fast and committed to solving the problems of our customers."
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "*How does this impact you?* \n Your current installation of Cheersly will no longer work. But the good news is that you can use Cheersly by joining our private beta program. We're prioritizing people ops managers at fast-growing startups that use Slack. If you're a fit, you'll get access to Cheersly and help us improve remote team connection. Just send an email to support@cheersly.club with your interest and we will take it forward from there."
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Cheers :beers:"
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "Need help? contact support@cheersly.club"
            }
          ]
        }
      ]);
    };

    await pMap(auths, handler, { concurrency: 1 });
  } catch (error) {
    logger.error("POLLS CRON SERVICE FAILED -> error : ", error);
  }
};

// Connect To Database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, {
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

// On Connection
mongoose.connection.on("connected", async () => {
  try {
    logger.info("Connected to database from notify customers script");

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
    "Database error from notify customers script -> error : ",
    error
  );
});
