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

    const block = actions[0].block_id;

    const movePosition = actions[0].action_id;

    logger.debug("movePosition : ", movePosition);

    let currentMove = 0;

    if (String(block).includes(1)) {
      if (String(movePosition).includes("_1")) {
        currentMove = 1;
      }

      if (String(movePosition).includes("_2")) {
        currentMove = 2;
      }

      if (String(movePosition).includes("_3")) {
        currentMove = 3;
      }
    }

    if (String(block.includes(2))) {
      if (String(movePosition).includes("_1")) {
        currentMove = 4;
      }

      if (String(movePosition).includes("_2")) {
        currentMove = 5;
      }

      if (String(movePosition).includes("_3")) {
        currentMove = 6;
      }
    }

    if (String(block.includes(3))) {
      if (String(movePosition).includes("_1")) {
        currentMove = 7;
      }

      if (String(movePosition).includes("_2")) {
        currentMove = 8;
      }

      if (String(movePosition).includes("_3")) {
        currentMove = 9;
      }
    }

    logger.debug("currentMove : ", currentMove);

    const game = await TicTacToeModel.findOne({ gameId });

    if (!game.playerOne) {
      // first move

      //   const { blocks } = game;

      //   blocks.push(createMovePlayedTemplate(userId));

      await TicTacToeModel.updateOne(
        { gameId },
        {
          $set: {
            playerOne: userId,
            playerOneMove: currentMove,
            // blocks,
          },
        }
      );

      //   return await postMessageToResponseUrl({
      //     responseUrl: response_url,
      //     replaceOriginal: true,
      //     message: blocks,
      //   });
    }

    // second move

    const { playerOne, playerOneMove } = game;

    if (playerOne === userId) {
      return await openModal(
        teamId,
        trigger_id,
        moveAlreadyPlayedModalTemplate()
      );
    }

    // let winner = null;
    // let draw = false;

    const playerTwo = userId;
    const playerTwoMove = currentMove;
  } catch (error) {
    logger.error("handleTicTacToe() -> error : ", error);
  }
};

module.exports = { handleTicTacToe };
