const { openModal } = require("../../api");
const { createCustomerFeedbackTemplate } = require("./template");
const logger = require("../../../global/logger");

const handleCustomerFeedback = async payload => {
  try {
    const {
      trigger_id,
      team: { id: teamId },
    } = payload;

    await openModal(teamId, trigger_id, createCustomerFeedbackTemplate());
  } catch (error) {
    logger.error("handleCustomerFeedback() -> error : ", error);
  }
};

module.exports = { handleCustomerFeedback };
