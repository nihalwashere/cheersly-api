const SettingsModel = require("../../../mongo/models/Settings");
const RecognitionTeamsModel = require("../../../mongo/models/RecognitionTeams");
const { postEphemeralMessage, openModal } = require("../../api");
const { createChannelNotSetupTemplate } = require("./template");
const { submitCheersTemplate } = require("../../templates");
const { wrapCompanyValueOptionsForTeam } = require("../../helper");
const {
  getCurrentMonthTotalSpentForUserByRecognitionTeam,
} = require("../../../concerns/cheers");
const {
  VIEW_SUBMISSIONS: { SAY_CHEERS },
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const handleCheersCommand = async (
  teamId,
  userId,
  triggerId,
  channelId,
  channelName
) => {
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
      return {
        message: true,
        blocks: createChannelNotSetupTemplate(teamId, recognitionTeams),
      };
      // return await postEphemeralMessage(
      //   channelId,
      //   userId,
      //   teamId,
      //   createChannelNotSetupTemplate(teamId, recognitionTeams)
      // );
    }

    const teamSettings = await SettingsModel.findOne({ teamId });

    const {
      _id: recognitionTeamId,
      pointAmountOptions,
      pointAllowance,
    } = recognitionTeam;

    const {
      currentMonthTotalSpentForRecognitionTeam,
    } = await getCurrentMonthTotalSpentForUserByRecognitionTeam(
      teamId,
      userId,
      recognitionTeamId
    );

    const remainingPointsForUser = Number(
      pointAllowance - currentMonthTotalSpentForRecognitionTeam
    );

    const metaData = JSON.stringify({
      channelId,
      channelName,
      recognitionTeamId: recognitionTeam._id,
      remainingPointsForUser,
    });

    await openModal(
      teamId,
      triggerId,
      submitCheersTemplate({
        metaData,
        callback_id: SAY_CHEERS,
        companyValueOptions,
        pointAmountOptions,
        remainingPointsForUser,
        teamSettings,
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
