const pMap = require("p-map");
const RecognitionTeamsModel = require("../../../mongo/models/RecognitionTeams");
const UserModel = require("../../../mongo/models/User");
const {
  BLOCK_IDS: { SUBMIT_CHEERS_TO_USERS },
} = require("../../../global/constants");
const {
  getConversationMembers,
} = require("../../pagination/conversations-members");
const { slackPostMessageToChannel } = require("../../api");
const { createCheersNewsInDMTemplate } = require("./template");
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

    let recognitionTeam = {};

    for (let i = 0; i < recipients.length; i += 1) {
      const recipient = recipients[i];

      const user = await UserModel.findOne({
        "slackUserData.id": recipient,
        "slackUserData.team_id": teamId,
        slackDeleted: false,
      });

      recognitionTeam = await RecognitionTeamsModel.findOne({
        _id: recognitionTeamId,
        teamId,
      });

      if (!user) {
        await getConversationMembers(teamId, recognitionTeamId, channelId);

        recognitionTeam = await RecognitionTeamsModel.findOne({
          _id: recognitionTeamId,
          teamId,
        });

        const newlySyncedUser = await UserModel.findOne({
          "slackUserData.id": recipient,
          "slackUserData.team_id": teamId,
          slackDeleted: false,
        });

        if (
          !newlySyncedUser ||
          !recognitionTeam.members.includes(newlySyncedUser._id)
        ) {
          return {
            errors: {
              [SUBMIT_CHEERS_TO_USERS]:
                "Contains users who aren't in this channel.",
            },
          };
        }

        validRecipients.push({
          id: newlySyncedUser.slackUserData.id,
          name: newlySyncedUser.slackUserData.real_name,
        });
      }

      if (user && user.slackUserData.id === senderUserId) {
        return {
          errors: {
            [SUBMIT_CHEERS_TO_USERS]:
              "Oops! You can't give yourself a shoutout, for obvious reasons, duhh!",
          },
        };
      }

      if (!recognitionTeam.members.includes(user._id)) {
        return {
          errors: {
            [SUBMIT_CHEERS_TO_USERS]:
              "Contains users who aren't in this channel.",
          },
        };
      }

      if (user) {
        validRecipients.push({
          id: user.slackUserData.id,
          name: user.slackUserData.real_name,
        });
      }
    }

    return { validRecipients };
  } catch (error) {
    logger.error("validateRecipients() -> error : ", error);
  }
};

const shareCheersNewsWithRecipientsInDM = async (
  teamId,
  recipients,
  permaLink,
  points,
  senderUserId,
  channelId
) => {
  try {
    const handler = async recipient => {
      // TODO: get remaining redemption points for user

      await slackPostMessageToChannel(
        recipient.id,
        teamId,
        createCheersNewsInDMTemplate(permaLink, points, senderUserId, channelId)
      );
    };

    await pMap(recipients, handler, { concurrency: 1 });
  } catch (error) {
    logger.error("shareCheersNewsWithRecipientsInDM() -> error : ", error);
  }
};

module.exports = { validateRecipients, shareCheersNewsWithRecipientsInDM };
