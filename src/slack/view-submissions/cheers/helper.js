const pMap = require("p-map");
const {
  addUser,
  getUserDataBySlackUserId
} = require("../../../mongo/helper/user");
const { getSlackUser } = require("../../api");
const logger = require("../../../global/logger");

const validateRecipients = async (teamId, recipients) => {
  try {
    const validRecipients = [];

    const handler = async (recipient) => {
      const user = await getUserDataBySlackUserId(recipient);

      if (user) {
        validRecipients.push(user.slackUserData.name);
      } else {
        const slackUserData = await getSlackUser(teamId, recipient);

        if (
          !slackUserData.deleted &&
          !slackUserData.is_bot &&
          slackUserData.name !== "slackbot"
        ) {
          // add new user

          await addUser({ slackUserData });

          validRecipients.push(slackUserData.name);
        }
      }
    };

    await pMap(recipients, handler, { concurrency: 1 });

    return validRecipients;
  } catch (error) {
    logger.error("validateRecipients() -> error : ", error);
  }
};

module.exports = { validateRecipients };
