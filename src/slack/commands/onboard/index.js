const { slackPostMessageToChannel } = require("../../api");
const { createOnboardingTemplate } = require("../../onboarding/template");
const { getAppUrl } = require("../../../utils/common");
const logger = require("../../../global/logger");

const handleOnboardCommand = async (team_id, channel_id) => {
  try {
    // /cheers onboard

    await slackPostMessageToChannel(
      channel_id,
      team_id,
      createOnboardingTemplate(team_id, getAppUrl())
    );
  } catch (error) {
    logger.error("handleOnboardCommand() -> error : ", error);
  }
};

const isOnboardCommand = (text) => {
  if (String(text).trim().includes("on")) {
    return true;
  }

  return false;
};

module.exports = { isOnboardCommand, handleOnboardCommand };
