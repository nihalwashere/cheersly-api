const moment = require("moment-timezone");
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
const { addPollQuestions } = require("../../../mongo/helper/pollQuestions");
const { newIdString } = require("../../../utils/common");
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

    const pollId = newIdString();

    logger.debug("pollQuestion : ", pollQuestion);
    logger.debug("pollChannel : ", pollChannel);
    logger.debug("pollDuration : ", pollDuration);
    logger.debug("pollOptionA : ", pollOptionA);
    logger.debug("pollOptionB : ", pollOptionB);
    logger.debug("pollOptionC : ", pollOptionC);
    logger.debug("pollOptionD : ", pollOptionD);
    logger.debug("pollId : ", pollId);

    const pollOptions = [pollOptionA, pollOptionB];

    if (pollOptionC) {
      pollOptions.push(pollOptionC);
    }

    if (pollOptionD) {
      pollOptions.push(pollOptionD);
    }

    let pollDurationString = "";

    const pollDurationNumber = Number(pollDuration);

    if (pollDurationNumber > 60) {
      pollDurationString = `${pollDurationNumber / 60} hours`;
    } else {
      pollDurationString = `${pollDurationNumber} mins`;
    }

    const template = createPollSubmittedTemplate(
      pollId,
      user_name,
      pollQuestion,
      pollDurationString,
      pollOptions
    );

    const poll = await addPollQuestions({
      createdBy: user_name,
      teamId,
      question: pollQuestion,
      channel: pollChannel,
      duration: pollDurationString,
      options: pollOptions,
      pollId,
      closeAt: moment().add(pollDurationNumber, "minutes").toDate(),
      pollSubmittedTemplate: JSON.stringify(template)
    });

    const slackMessageResponse = await slackPostMessageToChannel(
      pollChannel,
      teamId,
      template,
      true
    );

    logger.debug("slackMessageResponse : ", slackMessageResponse);

    if (slackMessageResponse && slackMessageResponse.ok) {
      poll.messageTimestamp = slackMessageResponse.ts;
      poll.save();
    }
  } catch (error) {
    logger.error("processPoll() -> error : ", error);
  }
};

module.exports = { processPoll };