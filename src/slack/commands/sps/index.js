const { slackPostMessageToChannel } = require("../../api");
const { createPlayStonePaperScissorsTemplate } = require("./template");
const logger = require("../../../global/logger");

const handleStonePaperScissorsCommand = async (team_id, user_id, user_name) => {
  try {
    // /cheers sps

    await slackPostMessageToChannel(
      user_id,
      team_id,
      createPlayStonePaperScissorsTemplate(user_name)
    );
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
