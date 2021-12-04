const { nanoid } = require("nanoid");
const TicTacToeModel = require("../../../mongo/models/TicTacToe");
const {
  createAllowedOnlyInDMTemplate,
  createPlayStonePaperScissorsTemplate,
} = require("./template");
const logger = require("../../../global/logger");

const handleTicTacToeCommand = async (teamId, userId, channelId) => {
  try {
    // /cheers ttt

    if (String(channelId).charAt(0) === "C") {
      // command executed in channel or multi person chat
      return {
        response_type: "ephemeral",
        blocks: createAllowedOnlyInDMTemplate(),
      };
    }

    const gameId = nanoid(10);

    const blocks = createPlayStonePaperScissorsTemplate(userId, gameId);

    await new TicTacToeModel({
      teamId,
      gameId,
      blocks,
    }).save();

    return {
      response_type: "in_channel",
      blocks,
    };
  } catch (error) {
    logger.error("handleTicTacToeCommand() -> error : ", error);
  }
};

const isTTTCommand = text => {
  if (
    String(text)
      .trim()
      .includes("tt")
  ) {
    return true;
  }

  return false;
};

module.exports = { handleTicTacToeCommand, isTTTCommand };
