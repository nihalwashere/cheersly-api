const {
  BLOCK_IDS: { NEW_INTEREST },
  ACTION_IDS: { NEW_INTEREST_VALUE }
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const processAddNewInterest = async (payload) => {
  try {
    logger.info("processAddNewInterest");
    const {
      user: { id: slackUserId },
      team: { id: teamId },
      view: { state }
    } = payload;

    const newInterest = state.values[NEW_INTEREST][NEW_INTEREST_VALUE].value;

    logger.debug("newInterest : ", newInterest);
  } catch (error) {
    logger.error("processAddNewInterest() -> error : ", error);
  }
};

module.exports = { processAddNewInterest };
