const { slackPostMessageToChannel } = require("../api");
const { createOnboardingTemplate } = require("./template");
const logger = require("../../global/logger");

const sendOnBoardingInstructions = async (channelId, teamId) => {
  try {
    const template = createOnboardingTemplate();
    await slackPostMessageToChannel(channelId, teamId, template);
  } catch (error) {
    logger.error(`sendOnBoardingInstructions() -> error : ${error}`);
  }
};

module.exports = {
  sendOnBoardingInstructions
};
