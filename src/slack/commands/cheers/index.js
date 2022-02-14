const RecognitionTeamsModel = require("../../../mongo/models/RecognitionTeams");
const { postEphemeralMessage, openModal } = require("../../api");
const { createChannelNotSetupTemplate } = require("./template");
const { submitCheersTemplate } = require("../../templates");
const { wrapCompanyValueOptionsForTeam } = require("../../helper");
const {
  VIEW_SUBMISSIONS: { SAY_CHEERS },
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const handleCheersCommand = async (
  teamId,
  userName,
  userId,
  triggerId,
  channelId
) => {
  try {
    // /cheers

    const companyValueOptions = await wrapCompanyValueOptionsForTeam(teamId);

    // first check if there's a recognition team created for this channel

    const recognitionTeams = await RecognitionTeamsModel.find({
      teamId,
    });

    if (!recognitionTeams.some(elem => elem.channel === channelId)) {
      return await postEphemeralMessage(
        channelId,
        userId,
        teamId,
        createChannelNotSetupTemplate(teamId, recognitionTeams)
      );
    }

    const viewTemplate = submitCheersTemplate(
      userName,
      SAY_CHEERS,
      companyValueOptions
    );

    await openModal(teamId, triggerId, viewTemplate);
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
