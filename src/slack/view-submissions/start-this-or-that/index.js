// const { updateModal } = require("../../api");
const {
  BLOCK_IDS: { SELECT_THIS_OR_THAT_CHANNEL },
  ACTION_IDS: { SELECT_THIS_OR_THAT_CHANNEL_VALUE },
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const processStartThisOrThat = async payload => {
  try {
    const {
      user: { id: userId },
      team: { id: teamId },
      view: { state },
    } = payload;

    const gameChannel =
      state.values[SELECT_THIS_OR_THAT_CHANNEL][
        SELECT_THIS_OR_THAT_CHANNEL_VALUE
      ].value;

    logger.debug("gameChannel : ", gameChannel);
  } catch (error) {
    logger.error("processStartThisOrThat() -> error : ", error);
  }
};

module.exports = { processStartThisOrThat };
