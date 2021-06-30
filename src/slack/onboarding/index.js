const pMap = require("p-map");
const { postMessageToHook, slackPostMessageToChannel } = require("../api");
const { getUsersForTeam } = require("../../mongo/helper/user");
const { waitForMilliSeconds } = require("../../utils/common");
const { createOnboardingTemplate } = require("./template");
const logger = require("../../global/logger");

const sendOnBoardingInstructions = async (teamId) => {
  try {
    await postMessageToHook(teamId, createOnboardingTemplate());
  } catch (error) {
    logger.error(`sendOnBoardingInstructions() -> error : ${error}`);
  }
};

const sendPersonalOnBoardingInstructions = async (teamId) => {
  try {
    const users = await getUsersForTeam(teamId);

    const handler = async (user) => {
      const {
        slackUserData: { id: channel }
      } = user;

      await slackPostMessageToChannel(
        channel,
        teamId,
        createOnboardingTemplate()
      );

      await waitForMilliSeconds(1000);
    };

    await pMap(users, handler, { concurrency: 1 });
  } catch (error) {
    logger.error(`sendPersonalOnBoardingInstructions() -> error : ${error}`);
  }
};

module.exports = {
  sendOnBoardingInstructions,
  sendPersonalOnBoardingInstructions
};
