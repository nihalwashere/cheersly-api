const mongoose = require("mongoose");
const pMap = require("p-map");
const R = require("ramda");
const { MONGO_URL, MONGO_OPTIONS } = require("../global/config");
const {
  getClosedPolls,
  markPollAsClosed
} = require("../mongo/helper/pollQuestions");
const { getUserDataBySlackUserName } = require("../mongo/helper/user");
const { getAllPollAnswers } = require("../mongo/helper/pollAnswers");
const { slackPostMessageToChannel, updateChat } = require("../slack/api");

const logger = require("../global/logger");

const createNotifyPollResultsToCreatorTemplate = (pollCompletedTemplate) => {
  const blocks = pollCompletedTemplate;

  blocks[0].text.text = "*Results for poll submission*";

  blocks.splice(blocks.length - 1, 1);

  return blocks;
};

const service = async () => {
  try {
    logger.info("STARTING POLLS CRON SERVICE");

    // fetch all poll questions that are closed

    const closedPolls = await getClosedPolls();
    logger.debug("closedPolls : ", closedPolls);

    // update all closed polls and send results to poll creator

    const handler = async (poll) => {
      const {
        createdBy,
        pollSubmittedTemplate,
        channel,
        messageTimestamp,
        pollId
      } = poll;

      const user = await getUserDataBySlackUserName(createdBy);

      if (user) {
        const {
          slackUserData: { id: slackUserId, team_id }
        } = user;

        const pollAnswers = await getAllPollAnswers(pollId);

        const totalPollAnswers = pollAnswers.length;
        logger.debug("totalPollAnswers : ", totalPollAnswers);

        const pollOptions = pollAnswers.map(({ answer }) => answer);
        logger.debug("pollOptions : ", pollOptions);

        const uniquePollOptions = R.uniq(pollOptions);
        logger.debug("uniquePollOptions : ", uniquePollOptions);

        const results = {};

        uniquePollOptions.map((option) => {
          results[option] = 0;
        });

        logger.debug("results : ", results);

        const parsedPollSubmittedTemplate = JSON.parse(pollSubmittedTemplate);

        logger.debug("pollSubmittedTemplate : ", parsedPollSubmittedTemplate);

        const pollCompletedTemplate = [];

        parsedPollSubmittedTemplate.map((section, index) => {
          if (section.accessory) {
            const pollOption = String(section.accessory.value).split(
              "-----"
            )[1];
            logger.debug("pollOption : ", pollOption);

            pollAnswers.map(({ answer }) => {
              logger.debug("answer : ", answer);

              if (answer === pollOption) {
                results[pollOption] += 1;
              }
            });

            const percentageResult = results[pollOption]
              ? Math.ceil((results[pollOption] / totalPollAnswers) * 100)
              : 0;

            pollCompletedTemplate.push({
              type: section.type,
              text: {
                type: section.text.type,
                text: section.text.text + " = *" + percentageResult + "%*"
              }
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

        logger.debug("results : ", results);

        await updateChat(
          team_id,
          channel,
          messageTimestamp,
          pollCompletedTemplate
        );

        // notify poll creator with results
        await slackPostMessageToChannel(
          slackUserId,
          team_id,
          createNotifyPollResultsToCreatorTemplate(pollCompletedTemplate)
        );

        // mark poll as closed
        await markPollAsClosed(pollId);
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
