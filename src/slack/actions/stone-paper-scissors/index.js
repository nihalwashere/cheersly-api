const { postMessageToResponseUrl } = require("../../api");
const { createMovePlayedTemplate } = require("./template");
const logger = require("../../../global/logger");

const handleStonePaperScissors = async (payload) => {
  try {
    logger.info("handleStonePaperScissors");

    const {
      // user: { id: userId },
      // channel: { id: channelId },
      team: { id: teamId },
      response_url,
      actions
    } = payload;

    const move = actions[0].value;
    logger.debug("move : ", move);

    await postMessageToResponseUrl(
      teamId,
      createMovePlayedTemplate(),
      response_url
    );
  } catch (error) {
    logger.error("handleStonePaperScissors() -> error : ", error);
  }
};

module.exports = { handleStonePaperScissors };
