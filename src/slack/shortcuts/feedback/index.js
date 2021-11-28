const { openModal } = require("../../api");
const { createSubmitAFeedbackTemplate } = require("../../templates");
const {
  VIEW_SUBMISSIONS: { FEEDBACK },
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const processFeedbackShortcut = async payload => {
  try {
    logger.debug("processFeedbackShortcut");

    const {
      team: { id: teamId },
      user: { username },
      trigger_id,
    } = payload;

    const viewTemplate = createSubmitAFeedbackTemplate(username, FEEDBACK);

    await openModal(teamId, trigger_id, viewTemplate);
  } catch (error) {
    logger.error("processFeedbackShortcut() -> error : ", error);
  }
};

module.exports = { processFeedbackShortcut };
