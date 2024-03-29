const { slackPostMessageToChannel } = require("../../api");
const { createDirectMessageHelpTemplate } = require("./template");
const logger = require("../../../global/logger");

const handleDirectMessage = async payload => {
  try {
    const {
      team_id,
      event: { channel },
    } = payload;

    await slackPostMessageToChannel(
      channel,
      team_id,
      createDirectMessageHelpTemplate()
    );
  } catch (error) {
    logger.error(
      `handleDirectMessage() : Failed to post message to slack for user ${payload.event.user} ->`,
      error
    );
  }
};

module.exports = { handleDirectMessage };
