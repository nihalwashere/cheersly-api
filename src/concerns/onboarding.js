const pMap = require("p-map");
const UserModel = require("../mongo/models/User");
const { slackPostMessageToChannel } = require("../slack/api");
const { createOnboardingTemplate } = require("../slack/templates");
const logger = require("../global/logger");

const sendOnBoardingInstructionsToInstaller = async (teamId, authedUserId) => {
  try {
    await slackPostMessageToChannel(
      authedUserId,
      teamId,
      createOnboardingTemplate(teamId)
    );
  } catch (error) {
    logger.error("sendOnBoardingInstructionsToInstaller() -> error : ", error);
  }
};

const sendOnBoardingInstructionsToAllUsers = async (
  teamId,
  customMessage = ""
) => {
  try {
    const users = await UserModel.find({ "slackUserData.team_id": teamId });

    const template = customMessage
      ? [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: customMessage,
            },
          },
        ]
      : createOnboardingTemplate(teamId);

    const handler = async user => {
      await slackPostMessageToChannel(user.slackUserData.id, teamId, template);
    };

    await pMap(users, handler, { concurrency: 1 });
  } catch (error) {
    logger.error("sendOnBoardingInstructionsToInstaller() -> error : ", error);
  }
};

module.exports = {
  sendOnBoardingInstructionsToInstaller,
  sendOnBoardingInstructionsToAllUsers,
};
