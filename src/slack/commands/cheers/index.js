const CheersStatsModel = require("../../../mongo/models/CheersStats");
const RecognitionTeamsModel = require("../../../mongo/models/RecognitionTeams");
const { postEphemeralMessage, openModal } = require("../../api");
const { createChannelNotSetupTemplate } = require("./template");
const { submitCheersTemplate } = require("../../templates");
const { wrapCompanyValueOptionsForTeam } = require("../../helper");
const {
  VIEW_SUBMISSIONS: { SAY_CHEERS },
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const handleCheersCommand = async (teamId, userId, triggerId, channelId) => {
  try {
    // /cheers

    const companyValueOptions = await wrapCompanyValueOptionsForTeam(teamId);

    // first check if there's a recognition team created for this channel

    const recognitionTeams = await RecognitionTeamsModel.find({
      teamId,
    });

    const recognitionTeam = recognitionTeams.find(
      elem => elem.channel.id === channelId
    );

    if (!recognitionTeam) {
      return await postEphemeralMessage(
        channelId,
        userId,
        teamId,
        createChannelNotSetupTemplate(teamId, recognitionTeams)
      );
    }

    const {
      _id: recognitionTeamId,
      pointAmountOptions,
      pointAllowance,
    } = recognitionTeam;

    const metaData = JSON.stringify({
      channelId,
      recognitionTeamId: recognitionTeam._id,
    });

    let remainingPointsForUser = 0;

    const cheersStatsSender = await CheersStatsModel.findOne({
      recognitionTeamId,
      slackUserId: userId,
      teamId,
    });

    if (cheersStatsSender) {
      remainingPointsForUser =
        Number(pointAllowance) - cheersStatsSender.cheersGiven;
    }

    await openModal(
      teamId,
      triggerId,
      submitCheersTemplate({
        metaData,
        callback_id: SAY_CHEERS,
        companyValueOptions,
        pointAmountOptions,
        remainingPointsForUser,
      })
    );
  } catch (error) {
    logger.error("handleCheersCommand() -> error : ", error);
  }
};

const isCheersCommand = text => {
  if (
    String(text)
      .trim()
      .includes("@") ||
    String(text).trim() === ""
  ) {
    return true;
  }

  return false;
};

module.exports = { isCheersCommand, handleCheersCommand };
