// const { openModal } = require("../../api");
// const { createThisOrThatResultsView } = require("./template");
// const {
//   BLOCK_IDS: { THIS_OR_THAT_PLAYED },
// } = require("../../../global/constants");
const logger = require("../../../global/logger");

const handleThisOrThatPlayed = async payload => {
  try {
    // const {
    // trigger_id,
    //   user: { id: userId },
    // team: { id: teamId },
    //   channel: { id: channelId },
    // } = payload;

    logger.debug("handleThisOrThatPlayed : ", payload);
  } catch (error) {
    logger.error("handleThisOrThatPlayed() -> error : ", error);
  }
};

module.exports = { handleThisOrThatPlayed };
