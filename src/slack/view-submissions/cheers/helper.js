const RecognitionTeamsModel = require("../../../mongo/models/RecognitionTeams");
const UserModel = require("../../../mongo/models/User");
const {
  getConversationMembers,
} = require("../../pagination/conversations-members");
const {
  BLOCK_IDS: { SUBMIT_CHEERS_TO_USERS },
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const validateRecipients = async (
  teamId,
  recipients,
  senderUserId,
  recognitionTeamId,
  channelId
) => {
  try {
    const validRecipients = [];

    for (let i = 0; i < recipients.length; i += 1) {
      const recipient = recipients[i];

      const user = await UserModel.findOne({
        "slackUserData.id": recipient,
        "slackUserData.team_id": teamId,
        slackDeleted: false,
      });

      if (!user) {
        await getConversationMembers(teamId, recognitionTeamId, channelId);

        const recognitionTeam = await RecognitionTeamsModel.findOne({
          _id: recognitionTeamId,
          teamId,
        });

        const newlySyncedUser = await UserModel.findOne({
          "slackUserData.id": recipient,
          "slackUserData.team_id": teamId,
          slackDeleted: false,
        });

        if (!recognitionTeam.members.includes(newlySyncedUser._id)) {
          return {
            errors: {
              [SUBMIT_CHEERS_TO_USERS]:
                "Contains users who aren't in this channel.",
            },
          };
        }

        validRecipients.push(newlySyncedUser.slackUserData.id);
      }

      if (user && user.slackUserData.id === senderUserId) {
        return {
          errors: {
            [SUBMIT_CHEERS_TO_USERS]:
              "Oops! You can't give yourself a shoutout, for obvious reasons, duhh!",
          },
        };
      }

      validRecipients.push(user.slackUserData.id);
    }

    return { validRecipients };
  } catch (error) {
    logger.error("validateRecipients() -> error : ", error);
  }
};

module.exports = { validateRecipients };
