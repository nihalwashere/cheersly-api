const { openModal } = require("../../api");
const { createIcebreakerQuestionView } = require("./template");
const logger = require("../../../global/logger");

const handleTicTacToeHelp = async payload => {
  try {
    const {
      trigger_id,
      team: { id: teamId },
    } = payload;

    await openModal(teamId, trigger_id, createIcebreakerQuestionView());
  } catch (error) {
    logger.error("handleTicTacToeHelp() -> error : ", error);
  }
};

module.exports = { handleTicTacToeHelp };
