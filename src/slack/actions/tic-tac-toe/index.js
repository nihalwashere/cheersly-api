const {
  BLOCK_IDS: { TIC_TAC_TOE_ROW_1, TIC_TAC_TOE_ROW_2, TIC_TAC_TOE_ROW_3 },
  ACTION_IDS: {
    TIC_TAC_TOE_COLUMN_1,
    TIC_TAC_TOE_COLUMN_2,
    TIC_TAC_TOE_COLUMN_3,
  },
} = require("../../../global/constants");
const TicTacToeModel = require("../../../mongo/models/TicTacToe");
const { postMessageToResponseUrl, openModal } = require("../../api");
const {
  createFirstMovePlayedTemplate,
  createSecondMovePlayedTemplate,
  updateTicTacToeTemplate,
  createGameFinishedTemplate,
  createGameDrawedTemplate,
  moveAlreadyPlayedModalTemplate,
} = require("./template");
const logger = require("../../../global/logger");

const PLAYER_ONE = "PLAYER_ONE";
const PLAYER_TWO = "PLAYER_TWO";

const checkWin = moves => {
  let win = false;

  if (moves.includes(1) && moves.includes(2) && moves.includes(3)) {
    win = true;
  }

  if (moves.includes(4) && moves.includes(5) && moves.includes(6)) {
    win = true;
  }

  if (moves.includes(7) && moves.includes(8) && moves.includes(9)) {
    win = true;
  }

  if (moves.includes(1) && moves.includes(4) && moves.includes(7)) {
    win = true;
  }

  if (moves.includes(2) && moves.includes(5) && moves.includes(8)) {
    win = true;
  }

  if (moves.includes(3) && moves.includes(6) && moves.includes(9)) {
    win = true;
  }

  if (moves.includes(1) && moves.includes(5) && moves.includes(9)) {
    win = true;
  }

  if (moves.includes(3) && moves.includes(5) && moves.includes(7)) {
    win = true;
  }

  return win;
};

const handleTicTacToe = async payload => {
  try {
    const {
      user: { id: currentPlayer },
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
    let row = 0;
    let column = 0;

    if (block === TIC_TAC_TOE_ROW_1) {
      row = 1;

      if (movePosition === TIC_TAC_TOE_COLUMN_1) {
        column = 1;
        currentMove = 1;
      }

      if (movePosition === TIC_TAC_TOE_COLUMN_2) {
        column = 2;
        currentMove = 2;
      }

      if (movePosition === TIC_TAC_TOE_COLUMN_3) {
        column = 3;
        currentMove = 3;
      }
    }

    if (block === TIC_TAC_TOE_ROW_2) {
      row = 2;

      if (movePosition === TIC_TAC_TOE_COLUMN_1) {
        column = 1;
        currentMove = 4;
      }

      if (movePosition === TIC_TAC_TOE_COLUMN_2) {
        column = 2;
        currentMove = 5;
      }

      if (movePosition === TIC_TAC_TOE_COLUMN_3) {
        column = 3;
        currentMove = 6;
      }
    }

    if (block === TIC_TAC_TOE_ROW_3) {
      row = 3;

      if (movePosition === TIC_TAC_TOE_COLUMN_1) {
        column = 1;
        currentMove = 7;
      }

      if (movePosition === TIC_TAC_TOE_COLUMN_2) {
        column = 2;
        currentMove = 8;
      }

      if (movePosition === TIC_TAC_TOE_COLUMN_3) {
        column = 3;
        currentMove = 9;
      }
    }

    logger.debug("currentPlayer : ", currentPlayer);
    logger.debug("currentMove : ", currentMove);

    const game = await TicTacToeModel.findOne({ gameId });

    if (!game.playerOne) {
      // first move

      const { blocks } = game;

      const updatedBlocks = createFirstMovePlayedTemplate({
        currentPlayer,
        row,
        column,
        blocks,
      });

      await TicTacToeModel.updateOne(
        { gameId },
        {
          $set: {
            playerOne: currentPlayer,
            playerOneMoves: [currentMove],
            turn: PLAYER_TWO, // next player to play
            blocks: updatedBlocks,
          },
        }
      );

      return await postMessageToResponseUrl({
        responseUrl: response_url,
        replaceOriginal: true,
        message: updatedBlocks,
      });
    }

    if (!game.playerTwo) {
      // second move

      if (game.turn === PLAYER_TWO && currentPlayer === game.playerOne) {
        return await openModal(
          teamId,
          trigger_id,
          moveAlreadyPlayedModalTemplate()
        );
      }

      const { blocks } = game;

      const updatedBlocks = createSecondMovePlayedTemplate({
        playerOne: game.playerOne,
        playerTwo: currentPlayer,
        row,
        column,
        blocks,
      });

      await TicTacToeModel.updateOne(
        { gameId },
        {
          $set: {
            playerTwo: currentPlayer,
            playerTwoMoves: [currentMove],
            turn: PLAYER_ONE, // next player to play
            blocks: updatedBlocks,
          },
        }
      );

      return await postMessageToResponseUrl({
        responseUrl: response_url,
        replaceOriginal: true,
        message: updatedBlocks,
      });
    }

    // alternate moves

    const {
      turn,
      playerOne,
      playerOneMoves,
      playerTwo,
      playerTwoMoves,
      blocks,
    } = game;

    if (
      (turn === PLAYER_ONE && currentPlayer !== playerOne) ||
      (turn === PLAYER_TWO && currentPlayer !== playerTwo)
    ) {
      return await openModal(
        teamId,
        trigger_id,
        moveAlreadyPlayedModalTemplate()
      );
    }

    let winner = null;
    const draw = false;
    let finished = true;
    let updatedTurn = null;

    // WIN CASES

    const updatedPlayerOneMoves = [...playerOneMoves];
    const updatedPlayerTwoMoves = [...playerTwoMoves];

    if (currentPlayer === playerOne) {
      updatedPlayerOneMoves.push(currentMove);
      updatedTurn = PLAYER_TWO;

      if (checkWin(updatedPlayerOneMoves)) {
        winner = playerOne;
        finished = true;
      }
    }

    if (currentPlayer === playerTwo) {
      updatedPlayerTwoMoves.push(currentMove);
      updatedTurn = PLAYER_ONE;

      if (checkWin(updatedPlayerTwoMoves)) {
        winner = playerTwo;
        finished = true;
      }
    }

    const updatedBlocks = updateTicTacToeTemplate({
      row,
      column,
      blocks,
      turn: updatedTurn === PLAYER_ONE ? ":x:" : ":o:",
    });

    await TicTacToeModel.updateOne(
      { gameId },
      {
        $set: {
          winner,
          draw,
          finished,
          turn: updatedTurn,
          playerOneMoves: updatedPlayerOneMoves,
          playerTwoMoves: updatedPlayerTwoMoves,
          blocks: updatedBlocks,
        },
      }
    );

    return await postMessageToResponseUrl({
      responseUrl: response_url,
      replaceOriginal: true,
      message: updatedBlocks,
    });
  } catch (error) {
    logger.error("handleTicTacToe() -> error : ", error);
  }
};

module.exports = { handleTicTacToe };