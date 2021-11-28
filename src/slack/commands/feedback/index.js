const { openModal } = require("../../api");
const { createSubmitAFeedbackTemplate } = require("../../templates");
const {
  VIEW_SUBMISSIONS: { FEEDBACK }
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const handleFeedbackCommand = async (team_id, user_name, trigger_id) => {
  try {
    // /cheers feedback

    const viewTemplate = createSubmitAFeedbackTemplate(user_name, FEEDBACK);

    await openModal(team_id, trigger_id, viewTemplate);
  } catch (error) {
    logger.error("handleFeedbackCommand() -> error : ", error);
  }
};

const isFeedbackCommand = (text) => {
  if (String(text).trim().includes("fe")) {
    return true;
  }

  return false;
};

module.exports = { isFeedbackCommand, handleFeedbackCommand };
