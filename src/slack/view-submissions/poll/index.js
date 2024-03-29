const moment = require("moment-timezone");
const {
  BLOCK_IDS: {
    POLL_QUESTION,
    SELECT_POLL_CHANNEL,
    SELECT_DURATION,
    POLL_IS_ANONYMOUS,
    POLL_OPTION_A,
    POLL_OPTION_B,
    POLL_OPTION_C,
    POLL_OPTION_D,
  },
  ACTION_IDS: {
    POLL_QUESTION_VALUE,
    SELECTED_POLL_CHANNEL,
    SELECTED_DURATION,
    POLL_IS_ANONYMOUS_VALUE,
    POLL_OPTION_A_VALUE,
    POLL_OPTION_B_VALUE,
    POLL_OPTION_C_VALUE,
    POLL_OPTION_D_VALUE,
  },
  SLACK_ERROR: { CHANNEL_NOT_FOUND },
} = require("../../../global/constants");
const { slackPostMessageToChannel } = require("../../api");
const { addPollQuestions } = require("../../../mongo/helper/pollQuestions");
const { newIdString } = require("../../../utils/common");
const { createPollSubmittedTemplate } = require("./template");
const {
  createNotInChannelTemplate,
  createGamePostedSuccessModalTemplate,
} = require("../../templates");
const logger = require("../../../global/logger");

const processPoll = async payload => {
  try {
    const {
      team: { id: teamId },
      view: { state, private_metadata: user_name },
    } = payload;

    const pollQuestion = state.values[POLL_QUESTION][POLL_QUESTION_VALUE].value;

    const pollChannel =
      state.values[SELECT_POLL_CHANNEL][SELECTED_POLL_CHANNEL]
        .selected_conversation;

    const pollDuration =
      state.values[SELECT_DURATION][SELECTED_DURATION].selected_option.value;

    const isAnonymous = state.values[POLL_IS_ANONYMOUS][POLL_IS_ANONYMOUS_VALUE]
      .selected_options.length
      ? true // eslint-disable-line
      : false;

    const pollOptionA = state.values[POLL_OPTION_A][POLL_OPTION_A_VALUE].value;

    const pollOptionB = state.values[POLL_OPTION_B][POLL_OPTION_B_VALUE].value;

    const pollOptionC = state.values[POLL_OPTION_C][POLL_OPTION_C_VALUE].value;

    const pollOptionD = state.values[POLL_OPTION_D][POLL_OPTION_D_VALUE].value;

    const pollId = newIdString();

    const pollOptions = [pollOptionA, pollOptionB];

    if (pollOptionC) {
      pollOptions.push(pollOptionC);
    }

    if (pollOptionD) {
      pollOptions.push(pollOptionD);
    }

    let pollDurationString = "";

    const pollDurationNumber = Number(pollDuration);

    const minsInADay = 24 * 60;

    // mins
    if (pollDurationNumber < 60 || pollDurationNumber === 60) {
      pollDurationString = `${pollDurationNumber} mins`;
    }

    // hours
    if (
      (pollDurationNumber > 60 || pollDurationNumber === 60) &&
      pollDurationNumber < minsInADay
    ) {
      const hours = pollDurationNumber / 60;
      const hourOrHours = hours > 1 ? "hours" : "hour";

      pollDurationString = `${hours} ${hourOrHours}`;
    }

    // days
    if (pollDurationNumber > minsInADay || pollDurationNumber === minsInADay) {
      const days = pollDurationNumber / 60 / 24;
      const dayOrDays = days > 1 ? "days" : "day";

      pollDurationString = `${days} ${dayOrDays}`;
    }

    const pollSubmittedTemplate = createPollSubmittedTemplate(
      pollId,
      user_name,
      pollQuestion,
      pollDurationString,
      pollOptions,
      isAnonymous
    );

    const response = await slackPostMessageToChannel(
      pollChannel,
      teamId,
      pollSubmittedTemplate
    );

    if (response && !response.ok && response.error === CHANNEL_NOT_FOUND) {
      return {
        push: true,
        view: createNotInChannelTemplate(),
      };
    }

    if (response && response.ok) {
      await addPollQuestions({
        createdBy: user_name,
        teamId,
        question: pollQuestion,
        channel: pollChannel,
        duration: pollDurationString,
        options: pollOptions,
        pollId,
        closeAt: moment()
          .add(pollDurationNumber, "minutes")
          .toDate(),
        pollSubmittedTemplate: JSON.stringify(pollSubmittedTemplate),
        messageTimestamp: response.ts,
      });

      return {
        update: true,
        view: createGamePostedSuccessModalTemplate({
          teamId,
          channelId: pollChannel,
          message: "*Poll posted successfully!*",
        }),
      };
    }
  } catch (error) {
    logger.error("processPoll() -> error : ", error);
  }
};

module.exports = { processPoll };
