const { openModal } = require("../../api");
const { createSubmitAPollTemplate } = require("../../templates");
const {
  VIEW_SUBMISSIONS: { POLL }
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const handlePollCommand = async (team_id, user_name, trigger_id) => {
  try {
    // /cheers poll

    const viewTemplate = createSubmitAPollTemplate(user_name, POLL);

    await openModal(team_id, trigger_id, viewTemplate);
  } catch (error) {
    logger.error("handlePollCommand() -> error : ", error);
  }
};

const isPollCommand = (text) => {
  if (
    String(text).trim().includes("p") ||
    String(text).trim().includes("po") ||
    String(text).trim().includes("pol") ||
    String(text).trim().includes("poll")
  ) {
    return true;
  }

  return false;
};

module.exports = { isPollCommand, handlePollCommand };
