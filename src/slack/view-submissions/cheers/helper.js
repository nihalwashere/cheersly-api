const pMap = require("p-map");
const UserModel = require("../../../mongo/models/User");
const { addUser } = require("../../../mongo/helper/user");
const { getSlackUser } = require("../../api");
const { UserRoles } = require("../../../enums/userRoles");
const logger = require("../../../global/logger");

const validateRecipients = async (teamId, recipients, senderUserId) => {
  try {
    const validRecipients = [];

    const handler = async recipient => {
      const user = await UserModel.findOne({
        "slackUserData.id": recipient,
        slackDeleted: false,
      });

      if (user && user.slackUserData.id !== senderUserId) {
        validRecipients.push(user.slackUserData.id);
      }

      if (!user) {
        const slackUserData = await getSlackUser(teamId, recipient);

        if (
          !slackUserData.deleted &&
          !slackUserData.is_bot &&
          slackUserData.name !== "slackbot"
        ) {
          // add new user

          await addUser({
            slackUserData,
            slackDeleted: false,
            appHomePublished: false,
            role: slackUserData.is_admin ? UserRoles.ADMIN : UserRoles.MEMBER,
          });

          validRecipients.push(slackUserData.id);
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
