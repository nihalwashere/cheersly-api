const { openModal } = require("../../api");
const { submitCheersTemplate } = require("../../templates");
const { wrapCompanyValueOptionsForTeam } = require("../../helper");
const {
  VIEW_SUBMISSIONS: { SAY_CHEERS },
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const handleCheersCommand = async (team_id, user_name, trigger_id) => {
  try {
    // /cheers

    const companyValueOptions = await wrapCompanyValueOptionsForTeam(team_id);

    const viewTemplate = submitCheersTemplate(
      user_name,
      SAY_CHEERS,
      companyValueOptions
    );

    await openModal(team_id, trigger_id, viewTemplate);
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
