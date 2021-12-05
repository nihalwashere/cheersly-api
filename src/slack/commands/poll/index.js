const { openModal } = require("../../api");
const { createSubmitAPollTemplate } = require("../../templates");
const {
  VIEW_SUBMISSIONS: { POLL },
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const handlePollCommand = async (team_id, user_name, trigger_id) => {
  try {
    // /cheers poll

    await openModal(
      team_id,
      trigger_id,
      createSubmitAPollTemplate(user_name, POLL)
    );
  } catch (error) {
    logger.error("handlePollCommand() -> error : ", error);
  }
};

const isPollCommand = text => {
  if (
    String(text)
      .trim()
      .includes("po")
  ) {
    return true;
  }

  return false;
};

module.exports = { isPollCommand, handlePollCommand };
