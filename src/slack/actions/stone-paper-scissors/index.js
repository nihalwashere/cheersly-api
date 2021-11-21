const { slackPostMessageToChannel } = require("../../api");
const { createMovePlayedTemplate } = require("./template");
const logger = require("../../../global/logger");

const handleStonePaperScissors = async (payload) => {
  try {
    logger.info("handleStonePaperScissors");

    const {
      // user: { id: userId },
      team: { id: teamId },
      channel: { id: channelId },
      actions
    } = payload;

    const move = actions[0].value;
    logger.debug("move : ", move);

    await slackPostMessageToChannel(
      channelId,
      teamId,
      createMovePlayedTemplate()
    );
  } catch (error) {
    logger.error("handleStonePaperScissors() -> error : ", error);
  }
};

module.exports = { handleStonePaperScissors };
