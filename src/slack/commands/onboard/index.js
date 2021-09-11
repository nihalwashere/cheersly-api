const { slackPostMessageToChannel } = require("../../api");
const { createOnboardingTemplate } = require("../../onboarding/template");
const { APP_NAME } = require("../../../global/config");
const { PROD_APP_URL, DEV_APP_URL } = require("../../../global/constants");
const logger = require("../../../global/logger");

const handleOnboardCommand = async (team_id, channel_id) => {
  try {
    // /cheers onboard

    const url = String(APP_NAME).includes("-dev") ? DEV_APP_URL : PROD_APP_URL;

    await slackPostMessageToChannel(
      channel_id,
      team_id,
      createOnboardingTemplate(url)
    );
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
