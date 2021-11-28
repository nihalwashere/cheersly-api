const { nanoid } = require("nanoid");
const StonePaperScissorsModel = require("../../../mongo/models/StonePaperScissors");
const {
  createAllowedOnlyInDMTemplate,
  createPlayStonePaperScissorsTemplate,
} = require("./template");
const logger = require("../../../global/logger");

const handleStonePaperScissorsCommand = async (
  team_id,
  user_id,
  channel_id
) => {
  try {
    // /cheers sps

    if (String(channel_id).charAt(0) === "C") {
      // command executed in channel or multi person chat
      return {
        response_type: "ephemeral",
        blocks: createAllowedOnlyInDMTemplate(),
      };
    }

    const gameId = nanoid(10);

    const blocks = createPlayStonePaperScissorsTemplate(user_id, gameId);

    await new StonePaperScissorsModel({
      teamId: team_id,
      gameId,
      blocks,
    }).save();

    return {
      response_type: "in_channel",
      blocks,
    };
  } catch (error) {
    logger.error("handleStonePaperScissorsCommand() -> error : ", error);
  }
};

const isSPSCommand = text => {
  if (
    String(text)
      .trim()
      .includes("sp")
  ) {
    return true;
  }

  return false;
};

module.exports = { handleStonePaperScissorsCommand, isSPSCommand };
