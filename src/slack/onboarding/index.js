const { postMessageToHook } = require("../api");
const { createOnboardingTemplate } = require("./template");
const logger = require("../../global/logger");

const sendOnBoardingInstructions = async (teamId) => {
  try {
    const template = createOnboardingTemplate();
    await postMessageToHook(teamId, template);
  } catch (error) {
    logger.error(`sendOnBoardingInstructions() -> error : ${error}`);
  }
};

module.exports = {
  sendOnBoardingInstructions
};
