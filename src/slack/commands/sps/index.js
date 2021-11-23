const { nanoid } = require("nanoid");
const StonePaperScissorsModel = require("../../../mongo/models/StonePaperScissors");
const { createPlayStonePaperScissorsTemplate } = require("./template");
const logger = require("../../../global/logger");

const handleStonePaperScissorsCommand = async (team_id, user_id) => {
  try {
    // /cheers sps

    const gameId = nanoid(10);

    const blocks = createPlayStonePaperScissorsTemplate(user_id, gameId);

    await new StonePaperScissorsModel({
      teamId: team_id,
      gameId,
      blocks
    }).save();

    return {
      response_type: "in_channel",
      blocks
    };
  } catch (error) {
    logger.error("handleStonePaperScissorsCommand() -> error : ", error);
  }
};

const isSPSCommand = (text) => {
  if (
    String(text)
      .trim()
      .includes("sp" || String(text).trim().includes("sps"))
  ) {
    return true;
  }

  return false;
};

module.exports = { handleStonePaperScissorsCommand, isSPSCommand };
