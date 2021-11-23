const {
  ACTION_IDS: { STONE_PLAYED, PAPER_PLAYED, SCISSORS_PLAYED }
} = require("../../../global/constants");
const StonePaperScissorsModel = require("../../../mongo/models/StonePaperScissors");
const { postMessageToResponseUrl, openModal } = require("../../api");
const {
  createMovePlayedTemplate,
  createGameFinishedTemplate,
  moveAlreadyPlayedModalTemplate
} = require("./template");
const logger = require("../../../global/logger");

const handleStonePaperScissors = async (payload) => {
  try {
    logger.info("handleStonePaperScissors");

    const {
      user: { id: userId },
      team: { id: teamId },
      trigger_id,
      response_url,
      actions
    } = payload;

    const gameId = actions[0].value;
    logger.debug("gameId : ", gameId);

    const currentMove = actions[0].action_id;
    logger.debug("currentMove : ", currentMove);

    const game = await StonePaperScissorsModel.findOne({ gameId });

    if (!game.playerOne) {
      // first move

      await new StonePaperScissorsModel({
        playerOne: userId,
        playerOneMove: currentMove
      }).save();

      return await postMessageToResponseUrl({
        responseUrl: response_url,
        message: createMovePlayedTemplate(userId)
      });
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

    let winner = null;
    let draw = false;

    const playerTwo = userId;
    const playerTwoMove = currentMove;

    // DRAW CASES

    if (playerOneMove === STONE_PLAYED && playerTwoMove === STONE_PLAYED) {
      // case 1
      logger.debug("DRAW CASE 1");
      draw = true;
    }

    if (playerOneMove === PAPER_PLAYED && playerTwoMove === PAPER_PLAYED) {
      // case 2
      logger.debug("DRAW CASE 2");
      draw = true;
    }

    if (
      playerOneMove === SCISSORS_PLAYED &&
      playerTwoMove === SCISSORS_PLAYED
    ) {
      // case 3
      logger.debug("DRAW CASE 3");
      draw = true;
    }

    // WIN CASES

    if (playerOneMove === STONE_PLAYED && playerTwoMove === PAPER_PLAYED) {
      // case 4
      logger.debug("PLAYER 2 WINS CASE 4");
      winner = playerTwo;
    }

    if (playerOneMove === STONE_PLAYED && playerTwoMove === SCISSORS_PLAYED) {
      // case 5
      logger.debug("PLAYER 1 WINS CASE 5");
      winner = playerOne;
    }

    if (playerOneMove === PAPER_PLAYED && playerTwoMove === STONE_PLAYED) {
      // case 6
      logger.debug("PLAYER 1 WINS CASE 6");
      winner = playerOne;
    }

    if (playerOneMove === PAPER_PLAYED && playerTwoMove === SCISSORS_PLAYED) {
      // case 7
      logger.debug("PLAYER 2 WINS CASE 7");
      winner = playerTwo;
    }

    if (playerOneMove === SCISSORS_PLAYED && playerTwoMove === STONE_PLAYED) {
      // case 8
      logger.debug("PLAYER 2 WINS CASE 8");
      winner = playerTwo;
    }

    if (playerOneMove === SCISSORS_PLAYED && playerTwoMove === PAPER_PLAYED) {
      // case 9
      logger.debug("PLAYER 1 WINS CASE 9");
      winner = playerOne;
    }

    await new StonePaperScissorsModel({
      playerTwo,
      playerTwoMove,
      winner,
      draw,
      finished: true
    }).save();

    return await postMessageToResponseUrl({
      responseUrl: response_url,
      replaceOriginal: true,
      message: createGameFinishedTemplate(userId)
    });
  } catch (error) {
    logger.error("handleStonePaperScissors() -> error : ", error);
  }
};

module.exports = { handleStonePaperScissors };
