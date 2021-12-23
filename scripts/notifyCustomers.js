require("dotenv").config();
const mongoose = require("mongoose");
const pMap = require("p-map");
const AuthModel = require("../src/mongo/models/Auth");
const UserModel = require("../src/mongo/models/User");
const { slackPostMessageToChannel } = require("../src/slack/api");
const { UserRoles } = require("../src/enums/userRoles");
const {
  getAppUrl,
  getAppHomeLink,
  waitForMilliSeconds,
} = require("../src/utils/common");
const logger = require("../src/global/logger");

const service = async () => {
  try {
    logger.info("STARTING NOTIFY CUSTOMERS SCRIPT");

    const auths = await AuthModel.find({
      slackDeleted: false,
      // "slackInstallation.team.id": "",
    });

    const handler = async auth => {
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
      });

      admins.map(admin => {
        if (!users.includes(admin.slackUserData.id)) {
          users.push(admin.slackUserData.id);
        }
      });

      for (let i = 0; i < users.length; i += 1) {
        await slackPostMessageToChannel(users[i], team_id, [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Hey there :wave:! Hope you are doing good!",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                "Christmas is just round the corner and we are here to share some gifts! YAAS! You heard that right, GIFTS! :gift:",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                "We are your :santa: and very excited to say that we have launched new features for *Cheersly*.",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Head over to the ${getAppHomeLink(
                team_id
              )} tab of Cheersly to,`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                ":point_right: Appreciate your peers by saying cheers :beers:",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: ":point_right: Ask anything by starting a poll :bar_chart:",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                ":point_right: Share feedback with your team and get heard :speech_balloon:",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: ":point_right: Play fun Icebreaker games :ice_cube:",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                ":point_right: Play Tic Tac Toe :x: :o: or Stone Paper Scissors :v: with your co-worker",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Deliver a fun, candid and social recognition & rewards experience for your employees. Recognize when employees align with your company values to reinforce good behavior. You can manage rewards and company values from the <${getAppUrl()}|app dashboard>.`,
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
              action_id: "INTRODUCE_TO_TEAM",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Excited right? Yes! We are too!",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                "We would be launching pricing plans for *Cheersly* starting from *15th Jan,2022*. You have three more weeks to try out Cheersly! Make the most of it. We are all ears and would love to hear back from you. Please feel free to write to us at support@cheersly.club",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Happy Holidays! :beers:",
            },
          },
        ]);

        await waitForMilliSeconds(1000);
      }
    };

    await pMap(auths, handler, { concurrency: 1 });
  } catch (error) {
    logger.error("NOTIFY CUSTOMERS SCRIPT ERROR : ", error);
  }
};

// Connect To Database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, {
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
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
mongoose.connection.on("error", error => {
  logger.error(
    "Database error from notify customers script -> error : ",
    error
  );
});
