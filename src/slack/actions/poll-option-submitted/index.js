const { postEphemeralMessage } = require("../../api");
const {
  addPollAnswers,
  getPollAnswerForUser,
  updatePollAnswerForUser,
} = require("../../../mongo/helper/pollAnswers");
const {
  createPollOptionSubmittedTemplate,
  createPollOptionAlreadySubmittedTemplate,
  createPollOptionUpdatedTemplate,
} = require("./template");
const logger = require("../../../global/logger");

const handlePollOptionSubmitted = async payload => {
  try {
    logger.info("handlePollOptionSubmitted");

    const {
      user: { id: userId },
      team: { id: teamId },
      channel: { id: channelId },
      actions,
    } = payload;

    const pollAnswer = actions[0].value;
    logger.debug("pollAnswer : ", pollAnswer);

    const pollId = String(pollAnswer).split("-----")[0];
    const pollOption = String(pollAnswer).split("-----")[1];

    const pollAnswerForUser = await getPollAnswerForUser(
      userId,
      teamId,
      pollId
    );

    logger.debug("pollAnswerForUser : ", pollAnswerForUser);

    if (pollAnswerForUser && pollAnswerForUser.answer === pollOption) {
      logger.debug("poll already submitted");
      return await postEphemeralMessage(
        channelId,
        userId,
        teamId,
        createPollOptionAlreadySubmittedTemplate()
      );
    }

    if (pollAnswerForUser && pollAnswerForUser.answer !== pollOption) {
      logger.debug("poll updated");

      await postEphemeralMessage(
        channelId,
        userId,
        teamId,
        createPollOptionUpdatedTemplate()
      );

      return await updatePollAnswerForUser(userId, teamId, pollId, pollOption);
    }

    logger.debug("poll option submitted");

    await addPollAnswers({
      slackUserId: userId,
      teamId,
      pollId,
      answer: pollOption,
    });

    await postEphemeralMessage(
      channelId,
      userId,
      teamId,
      createPollOptionSubmittedTemplate()
    );
  } catch (error) {
    logger.error("handlePollOptionSubmitted() -> error : ", error);
  }
};

module.exports = { handlePollOptionSubmitted };
