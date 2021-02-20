const { openModal } = require("../../api");
const { createSendUsFeedbackTemplate } = require("./template");
const logger = require("../../../global/logger");

const handleShareFeedback = async (payload) => {
  try {
    logger.info("handleShareFeedback");
    const {
      trigger_id,
      team: { id: teamId }
    } = payload;

    const viewTemplate = createSendUsFeedbackTemplate();

    // open description modal
    await openModal(teamId, trigger_id, viewTemplate);
  } catch (error) {
    logger.error("handleShareFeedback() -> error : ", error);
  }
};

module.exports = { handleShareFeedback };
