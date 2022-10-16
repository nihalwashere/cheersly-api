const { slackPostMessageToChannel } = require("../../api");
const { createOnboardingTemplate } = require("../../templates");
const logger = require("../../../global/logger");

const handleOnboardCommand = async (teamId, channelId) => {
  try {
    // /cheers onboard

    await slackPostMessageToChannel(
      channelId,
      teamId,
      createOnboardingTemplate(teamId)
    );
  } catch (error) {
    logger.error("handleOnboardCommand() -> error : ", error);
  }
};

const isOnboardCommand = text => {
  if (
    String(text)
      .trim()
      .includes("on")
  ) {
    return true;
  }

  return false;
};

module.exports = { isOnboardCommand, handleOnboardCommand };
