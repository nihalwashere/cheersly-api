const {
  BLOCK_IDS: { POLL_QUESTION, SELECT_POLL_CHANNEL, SELECT_DURATION },
  ACTION_IDS: { POLL_QUESTION_VALUE, SELECTED_POLL_CHANNEL, SELECTED_DURATION }
} = require("../../../global/constants");
const { slackPostMessageToChannel } = require("../../api");
const logger = require("../../../global/logger");

const processPoll = async (payload) => {
  try {
    logger.debug("processPoll : ", JSON.stringify(payload));

    const {
      team: { id: teamId },
      view: { state, private_metadata: channel_id }
    } = payload;

    const pollQuestion = state.values[POLL_QUESTION][POLL_QUESTION_VALUE].value;

    const pollChannel =
      state.values[SELECT_POLL_CHANNEL][SELECTED_POLL_CHANNEL].selected_option
        .value;

    const pollDuration =
      state.values[SELECT_DURATION][SELECTED_DURATION].selected_option.value;

    logger.debug("pollQuestion : ", pollQuestion);
    logger.debug("pollChannel : ", pollChannel);
    logger.debug("pollDuration : ", pollDuration);

    // await slackPostMessageToChannel(channel_id, teamId, [], true);
  } catch (error) {
    logger.error("processPoll() -> error : ", error);
  }
};

module.exports = { processPoll };
