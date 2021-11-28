// const { updateModal } = require("../../api");
const {
  BLOCK_IDS: { SELECT_ICEBREAKER_QUESTION_CHANNEL },
  ACTION_IDS: { SELECT_ICEBREAKER_QUESTION_CHANNEL_VALUE },
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const processStartIcebreakerQuestion = async payload => {
  try {
    const {
      user: { id: userId },
      team: { id: teamId },
      view: { state },
    } = payload;

    const gameChannel =
      state.values[SELECT_ICEBREAKER_QUESTION_CHANNEL][
        SELECT_ICEBREAKER_QUESTION_CHANNEL_VALUE
      ].value;

    logger.debug("gameChannel : ", gameChannel);
  } catch (error) {
    logger.error("processStartIcebreakerQuestion() -> error : ", error);
  }
};

module.exports = { processStartIcebreakerQuestion };
