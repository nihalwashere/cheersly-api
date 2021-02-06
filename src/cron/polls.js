const mongoose = require("mongoose");
const pMap = require("p-map");
const { MONGO_URL, MONGO_OPTIONS } = require("../global/config");
const { getClosedPolls } = require("../mongo/helper/pollQuestions");
const { getUserDataBySlackUserName } = require("../mongo/helper/user");
const logger = require("../global/logger");

const service = async () => {
  try {
    logger.info("STARTING POLLS CRON SERVICE");

    // fetch all poll questions that are closed

    const closedPolls = await getClosedPolls();
    logger.debug("closedPolls : ", closedPolls);

    // update all closed polls and send results to poll creator

    const handler = async (poll) => {
      const { createdBy, pollSubmittedTemplate, channel } = poll;

      const user = await getUserDataBySlackUserName(createdBy);

      if (user) {
        const {
          slackUserData: { id: slackUserId, team_id }
        } = user;

        const parsedPollSubmittedTemplate = JSON.parse(pollSubmittedTemplate);

        logger.debug("pollSubmittedTemplate : ", parsedPollSubmittedTemplate);

        const pollCompletedTemplate = [];

        parsedPollSubmittedTemplate.map((section, index) => {
          if (section.accessory) {
            pollCompletedTemplate.push({
              type: section.type,
              text: section.text
            });
          } else if (parsedPollSubmittedTemplate.length === index + 1) {
            pollCompletedTemplate.push({
              type: "section",
              text: {
                type: "mrkdwn",
                text: "_*Polling is closed*_"
              }
            });
          } else {
            pollCompletedTemplate.push(section);
          }
        });

        logger.debug("pollCompletedTemplate : ", pollCompletedTemplate);
      }
    };

    if (closedPolls && closedPolls.length) {
      await pMap(closedPolls, handler, { concurrency: 1 });
    }
  } catch (error) {
    logger.error("POLLS CRON SERVICE FAILED -> error : ", error);
  }
};

// Connect To Database
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL, {
  keepAlive: true,
  ...MONGO_OPTIONS
});

// On Connection
mongoose.connection.on("connected", async () => {
  try {
    logger.info("Connected to database from polls cron service");

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
  logger.error("Database error from polls cron service -> error : ", error);
});
