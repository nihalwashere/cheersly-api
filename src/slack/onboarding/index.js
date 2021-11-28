const { slackPostMessageToChannel } = require("../api");
const { createOnboardingTemplate } = require("./template");
const { getAppUrl } = require("../../utils/common");
const logger = require("../../global/logger");

const sendOnBoardingInstructions = async (teamId, authedUserId) => {
  try {
    await slackPostMessageToChannel(
      authedUserId,
      teamId,
      createOnboardingTemplate(teamId, getAppUrl())
    );
  } catch (error) {
    logger.error(`sendOnBoardingInstructions() -> error : ${error}`);
  }
};

module.exports = {
  sendOnBoardingInstructions,
};
