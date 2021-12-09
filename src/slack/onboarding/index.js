const { slackPostMessageToChannel } = require("../api");
const { createOnboardingTemplate } = require("./template");
const { getAppUrl, getAppHomeLink } = require("../../utils/common");
const logger = require("../../global/logger");

const sendOnBoardingInstructions = async (teamId, authedUserId) => {
  try {
    await slackPostMessageToChannel(
      authedUserId,
      teamId,
      createOnboardingTemplate({
        user: authedUserId,
        appUrl: getAppUrl(),
        appHomeUrl: getAppHomeLink(teamId),
      })
    );
  } catch (error) {
    logger.error(`sendOnBoardingInstructions() -> error : ${error}`);
  }
};

module.exports = {
  sendOnBoardingInstructions,
};
