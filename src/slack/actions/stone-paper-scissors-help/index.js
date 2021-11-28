const { openModal } = require("../../api");
const { createStonePaperScissorsHelpView } = require("./template");
const logger = require("../../../global/logger");

const handleStonePaperScissorsHelp = async payload => {
  try {
    const {
      trigger_id,
      team: { id: teamId },
    } = payload;

    await openModal(teamId, trigger_id, createStonePaperScissorsHelpView());
  } catch (error) {
    logger.error("handleStonePaperScissorsHelp() -> error : ", error);
  }
};

module.exports = { handleStonePaperScissorsHelp };
