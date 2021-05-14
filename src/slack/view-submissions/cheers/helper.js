const pMap = require("p-map");
const {
  addUser,
  getUserDataBySlackUserId
} = require("../../../mongo/helper/user");
const { getSlackUser } = require("../../api");
const { UserRoles } = require("../../../enums/userRoles");
const logger = require("../../../global/logger");

const validateRecipients = async (teamId, recipients, senderUsername) => {
  try {
    const validRecipients = [];

    const handler = async (recipient) => {
      const user = await getUserDataBySlackUserId(recipient);

      if (user && user.slackUserData.name !== senderUsername) {
        validRecipients.push(user.slackUserData.name);
      }

      if (!user) {
        const slackUserData = await getSlackUser(teamId, recipient);

        if (
          !slackUserData.deleted &&
          !slackUserData.is_bot &&
          slackUserData.name !== "slackbot"
        ) {
          // add new user

          const { isAdmin } = slackUserData;

          await addUser({
            slackUserData,
            slackDeleted: false,
            appHomePublished: false,
            role: isAdmin ? UserRoles.ADMIN : UserRoles.MEMBER
          });

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
