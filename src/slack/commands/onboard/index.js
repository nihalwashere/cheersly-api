const { slackPostMessageToChannel } = require("../../api");
const { createOnboardingTemplate } = require("../../onboarding/template");
const logger = require("../../../global/logger");

const handleOnboardCommand = async (team_id, channel_id) => {
  try {
    // /cheers onboard

    const onboardingTemplate = createOnboardingTemplate();

    await slackPostMessageToChannel(channel_id, team_id, onboardingTemplate);
  } catch (error) {
    logger.error("handleOnboardCommand() -> error : ", error);
  }
};

const isOnboardCommand = (text) => {
  if (
    String(text).trim().includes("on") ||
    String(text).trim().includes("onboard")
  ) {
    return true;
  }

  return false;
};

module.exports = { isOnboardCommand, handleOnboardCommand };
