const { postEphemeralMessage } = require("../../api");
const { createPollOptionSubmittedTemplate } = require("./template");
const logger = require("../../../global/logger");

const handlePollOptionSubmitted = async (payload) => {
  try {
    logger.info("handlePollOptionSubmitted");

    const {
      user: { id: userId },
      team: { id: teamId },
      channel: { id: channelId },
      actions
    } = payload;

    const pollOptionIndex = actions[0].value;

    logger.info("pollOptionIndex : ", pollOptionIndex);

    const template = createPollOptionSubmittedTemplate();

    await postEphemeralMessage(channelId, userId, teamId, template);
  } catch (error) {
    logger.error("handlePollOptionSubmitted() -> error : ", error);
  }
};

module.exports = { handlePollOptionSubmitted };
