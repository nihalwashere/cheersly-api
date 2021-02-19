const { openModal } = require("../../api");
const { createSubmitAPollTemplate } = require("../../templates");
const {
  VIEW_SUBMISSIONS: { POLL },
  SLACK_COMMANDS
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
  if (String(text).trim() === SLACK_COMMANDS.POLL) {
    return true;
  }

  return false;
};

module.exports = { isPollCommand, handlePollCommand };
