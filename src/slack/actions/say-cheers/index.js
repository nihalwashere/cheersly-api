const { openModal } = require("../../api");
const { submitCheersTemplate } = require("../../templates");
const {
  VIEW_SUBMISSIONS: { SAY_CHEERS }
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const handleSayCheers = async (payload) => {
  try {
    logger.info("handleSayCheers");

    const {
      trigger_id,
      user: { name: slackUserName },
      team: { id: teamId }
    } = payload;

    const viewTemplate = submitCheersTemplate(slackUserName, SAY_CHEERS);

    await openModal(teamId, trigger_id, viewTemplate);
  } catch (error) {
    logger.error("handleSayCheers() -> error : ", error);
  }
};

module.exports = { handleSayCheers };
