require("dotenv").config();
const mongoose = require("mongoose");
const pMap = require("p-map");
const { postMessageToHook } = require("../src/slack/api");
const logger = require("../src/global/logger");

// const teamIds = ["TT4G2QY1W", "T01PE2U3AKG"]; // prod
// const teamIds = ["TUDG6C681"]; // prod internal
// const teamIds = ["T018LGG2CTY"]; // dev

const service = async () => {
  try {
    logger.info("STARTING NOTIFY CUSTOMERS SCRIPT");

    const handler = async (teamId) => {
      await postMessageToHook(teamId, [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "*Hey there!* :wave: \n Hope everything is fine in that part of the world! \n\n We released *Polls* this week, it allows you to ask a question to your peers and analyze their responses right within Slack. You can use the command `/cheers poll` or alternatively you can use the `Submit a Poll` shortcut."
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "There's some good news, we have bumped your trial period until *April*. We are cooking some new features for you and would like you to try them out. "
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "This week we would be releasing the app dashboard (external to Slack). You can sign in using your Slack account associated with your current workspace where *Cheersly* is installed. You can view the leaderboard for your team in the app dashboard and drill down on who has given or received the most cheers for a specific duration and reward them."
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "We are also working on building a feedback system in Slack that would help you to share feedback with your team (anonymous/non-anonymous)."
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "We are all ears and we would love to get some feedback. You can share feedback by running `/cheers help` and clicking on the `Share Feedback` button. Alternatively, you can also get in touch with us at support@cheersly.club"
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Till then, stay safe and take care! \n\n Cheers :beers:"
          }
        }
      ]);
    };

    await pMap([], handler, { concurrency: 1 });
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
