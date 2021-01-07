const {
  BLOCK_IDS: {
    POLL_QUESTION,
    SELECT_POLL_CHANNEL,
    SELECT_DURATION,
    POLL_OPTION_A,
    POLL_OPTION_B,
    POLL_OPTION_C,
    POLL_OPTION_D
  },
  ACTION_IDS: {
    POLL_QUESTION_VALUE,
    SELECTED_POLL_CHANNEL,
    SELECTED_DURATION,
    POLL_OPTION_A_VALUE,
    POLL_OPTION_B_VALUE,
    POLL_OPTION_C_VALUE,
    POLL_OPTION_D_VALUE
  }
} = require("../../../global/constants");
const { slackPostMessageToChannel } = require("../../api");
const { createPollSubmittedTemplate } = require("./template");
const logger = require("../../../global/logger");

const processPoll = async (payload) => {
  try {
    logger.debug("processPoll : ", JSON.stringify(payload));

    const {
      team: { id: teamId },
      view: { state, private_metadata: user_name }
    } = payload;

    const pollQuestion = state.values[POLL_QUESTION][POLL_QUESTION_VALUE].value;

    const pollChannel =
      state.values[SELECT_POLL_CHANNEL][SELECTED_POLL_CHANNEL].selected_channel;

    const pollDuration =
      state.values[SELECT_DURATION][SELECTED_DURATION].selected_option.value;

    const pollOptionA = state.values[POLL_OPTION_A][POLL_OPTION_A_VALUE].value;

    const pollOptionB = state.values[POLL_OPTION_B][POLL_OPTION_B_VALUE].value;

    const pollOptionC = state.values[POLL_OPTION_C][POLL_OPTION_C_VALUE].value;

    const pollOptionD = state.values[POLL_OPTION_D][POLL_OPTION_D_VALUE].value;

    logger.debug("pollQuestion : ", pollQuestion);
    logger.debug("pollChannel : ", pollChannel);
    logger.debug("pollDuration : ", pollDuration);
    logger.debug("pollOptionA : ", pollOptionA);
    logger.debug("pollOptionB : ", pollOptionB);
    logger.debug("pollOptionC : ", pollOptionC);
    logger.debug("pollOptionD : ", pollOptionD);

    const template = createPollSubmittedTemplate(
      user_name,
      pollQuestion,
      pollDuration
    );

    await slackPostMessageToChannel(pollChannel, teamId, template, true);
  } catch (error) {
    logger.error("processPoll() -> error : ", error);
  }
};

module.exports = { processPoll };
