// const { openModal } = require("../../api");
// const { createThisOrThatResultsView } = require("./template");
const {
  ACTION_IDS: { THIS },
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const handleThisOrThatPlayed = async (payload, blockId) => {
  try {
    logger.debug("handleThisOrThatPlayed : ", payload);
    logger.debug("blockId : ", blockId);

    const {
      // user: { id: userId },
      // team: { id: teamId },
      // channel: { id: channelId },
      actions,
    } = payload;

    const { action_id, value } = actions[0];

    let thisValue = null;
    let thatValue = null;

    if (action_id === THIS) {
      thisValue = value;
    } else {
      thatValue = value;
    }

    logger.debug("thisValue : ", thisValue);
    logger.debug("thatValue : ", thatValue);
  } catch (error) {
    logger.error("handleThisOrThatPlayed() -> error : ", error);
  }
};

module.exports = { handleThisOrThatPlayed };
