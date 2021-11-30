const {
  ACTION_IDS: { STONE_PLAYED, PAPER_PLAYED, SCISSORS_PLAYED },
} = require("../../../global/constants");
const StonePaperScissorsModel = require("../../../mongo/models/StonePaperScissors");
const { postMessageToResponseUrl, openModal } = require("../../api");
const {
  createMovePlayedTemplate,
  createGameFinishedTemplate,
  createGameDrawedTemplate,
  moveAlreadyPlayedModalTemplate,
} = require("./template");
const logger = require("../../../global/logger");

const mapGameActionToEmoji = move => {
  const mapper = {
    [STONE_PLAYED]: ":punch:",
    [PAPER_PLAYED]: ":raised_hand_with_fingers_splayed:",
    [SCISSORS_PLAYED]: ":v:",
  };

  return mapper[move];
};

const handleStonePaperScissors = async payload => {
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

    const game = await StonePaperScissorsModel.findOne({ gameId });

    if (!game.playerOne) {
      // first move

      const { blocks } = game;

      blocks.push(createMovePlayedTemplate(userId));

      await StonePaperScissorsModel.updateOne(
        { gameId },
        {
          $set: {
            playerOne: userId,
            playerOneMove: currentMove,
            blocks,
          },
        }
      );

      return await postMessageToResponseUrl({
        responseUrl: response_url,
        replaceOriginal: true,
        message: blocks,
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
      draw = true;
    }

    if (playerOneMove === PAPER_PLAYED && playerTwoMove === PAPER_PLAYED) {
      // case 2
      draw = true;
    }

    if (
      playerOneMove === SCISSORS_PLAYED &&
      playerTwoMove === SCISSORS_PLAYED
    ) {
      // case 3
      draw = true;
    }

    // WIN CASES

    if (playerOneMove === STONE_PLAYED && playerTwoMove === PAPER_PLAYED) {
      // case 4
      winner = playerTwo;
    }

    if (playerOneMove === STONE_PLAYED && playerTwoMove === SCISSORS_PLAYED) {
      // case 5
      winner = playerOne;
    }

    if (playerOneMove === PAPER_PLAYED && playerTwoMove === STONE_PLAYED) {
      // case 6
      winner = playerOne;
    }

    if (playerOneMove === PAPER_PLAYED && playerTwoMove === SCISSORS_PLAYED) {
      // case 7
      winner = playerTwo;
    }

    if (playerOneMove === SCISSORS_PLAYED && playerTwoMove === STONE_PLAYED) {
      // case 8
      winner = playerTwo;
    }

    if (playerOneMove === SCISSORS_PLAYED && playerTwoMove === PAPER_PLAYED) {
      // case 9
      winner = playerOne;
    }

    await StonePaperScissorsModel.updateOne(
      { gameId },
      {
        $set: {
          playerTwo,
          playerTwoMove,
          winner,
          draw,
          finished: true,
        },
      }
    );

    let loser = null,
      loserMove = null,
      winnerMove = null;

    if (winner === playerOne) {
      loser = playerTwo;
      loserMove = playerTwoMove;
      winnerMove = playerOneMove;
    } else {
      loser = playerOne;
      loserMove = playerOneMove;
      winnerMove = playerTwoMove;
    }

    return await postMessageToResponseUrl({
      responseUrl: response_url,
      replaceOriginal: true,
      message: draw
        ? createGameDrawedTemplate(
            playerOne,
            playerTwo,
            mapGameActionToEmoji(currentMove)
          )
        : createGameFinishedTemplate({
            winner,
            winnerMoveEmoji: mapGameActionToEmoji(winnerMove),
            loser,
            loserMoveEmoji: mapGameActionToEmoji(loserMove),
          }),
    });
  } catch (error) {
    logger.error("handleStonePaperScissors() -> error : ", error);
  }
};

module.exports = { handleStonePaperScissors };
