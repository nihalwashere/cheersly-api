const { openModal } = require("../../api");
const { submitCheersTemplate } = require("../../templates");
const { wrapCompanyValueOptionsForTeam } = require("../../helper");
const {
  VIEW_SUBMISSIONS: { SAY_CHEERS },
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const processCheersShortcut = async payload => {
  try {
    const {
      team: { id: teamId },
      user: { username },
      trigger_id,
    } = payload;

    const companyValueOptions = await wrapCompanyValueOptionsForTeam(teamId);

    const viewTemplate = submitCheersTemplate(
      username,
      SAY_CHEERS,
      companyValueOptions
    );

    await openModal(teamId, trigger_id, viewTemplate);
  } catch (error) {
    logger.error("processCheersShortcut() -> error : ", error);
  }
};

module.exports = { processCheersShortcut };
