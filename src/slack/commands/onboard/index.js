const { slackPostMessageToChannel } = require("../../api");
const { createOnboardingTemplate } = require("../../onboarding/template");
const { getAppUrl, getAppHomeLink } = require("../../../utils/common");
const logger = require("../../../global/logger");

const handleOnboardCommand = async (teamId, channelId, userId) => {
  try {
    // /cheers onboard

    await slackPostMessageToChannel(
      channelId,
      teamId,
      createOnboardingTemplate({
        user: userId,
        appUrl: getAppUrl(),
        appHomeUrl: getAppHomeLink(teamId),
      })
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
