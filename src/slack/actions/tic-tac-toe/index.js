const {
  ACTION_IDS: {
    TIC_TAC_TOE_COLUMN_1,
    TIC_TAC_TOE_COLUMN_2,
    TIC_TAC_TOE_COLUMN_3,
  },
} = require("../../../global/constants");
const TicTacToeModel = require("../../../mongo/models/TicTacToe");
const { postMessageToResponseUrl, openModal } = require("../../api");
const {
  createMovePlayedTemplate,
  createGameFinishedTemplate,
  createGameDrawedTemplate,
  moveAlreadyPlayedModalTemplate,
} = require("./template");
const logger = require("../../../global/logger");

const handleTicTacToe = async payload => {
  try {
    const {
      user: { id: userId },
      team: { id: teamId },
      trigger_id,
      response_url,
      actions,
    } = payload;

    const gameId = actions[0].value;

    const currentMove = actions[0].action_id;

    logger.debug("currentMove : ", currentMove);
  } catch (error) {
    logger.error("handleTicTacToe() -> error : ", error);
  }
};

module.exports = { handleTicTacToe };
