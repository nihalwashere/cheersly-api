const { openModal } = require("../../api");
const { submitCheersTemplate } = require("../../templates");
const { wrapCompanyValueOptionsForTeam } = require("../../helper");
const {
  VIEW_SUBMISSIONS: { SAY_CHEERS },
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const handleSayCheers = async payload => {
  try {
    const {
      trigger_id,
      user: { name: slackUserName },
      team: { id: teamId },
    } = payload;

    const companyValueOptions = await wrapCompanyValueOptionsForTeam(teamId);

    await openModal(
      teamId,
      trigger_id,
      submitCheersTemplate(slackUserName, SAY_CHEERS, companyValueOptions)
    );
  } catch (error) {
    logger.error("handleSayCheers() -> error : ", error);
  }
};

module.exports = { handleSayCheers };
