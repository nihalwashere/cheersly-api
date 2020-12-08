const { slackPostMessageToChannel } = require("../../api");
const { createHelpTemplate } = require("./template");
const logger = require("../../../global/logger");

const handleHelp = async (teamId, channelId) => {
  try {
    logger.info("handleHelp");
    logger.info("teamId : ", teamId);
    logger.info("channelId : ", channelId);

    // send help message template
    const template = createHelpTemplate();

    // post message to slack
    await slackPostMessageToChannel(channelId, teamId, template, true);
  } catch (error) {
    logger.error("handleHelp() -> error : ", error);
  }
};

const isHelpCommand = (text) => {
  if (String(text).trim().includes("help")) {
    return true;
  }

  return false;
};

module.exports = { isHelpCommand, handleHelp };
