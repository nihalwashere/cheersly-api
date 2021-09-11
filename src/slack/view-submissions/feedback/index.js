const {
  BLOCK_IDS: { FEEDBACK_CHANNEL, FEEDBACK_DESCRIPTION, FEEDBACK_IS_ANONYMOUS },
  ACTION_IDS: {
    FEEDBACK_DESCRIPTION_VALUE,
    FEEDBACK_CHANNEL_VALUE,
    FEEDBACK_IS_ANONYMOUS_VALUE
  }
} = require("../../../global/constants");
const { slackPostMessageToChannel } = require("../../api");
const { createFeedbackSubmittedTemplate } = require("./template");
const { addFeedback } = require("../../../mongo/helper/feedback");
const logger = require("../../../global/logger");

const processFeedback = async (payload) => {
  try {
    logger.debug("processFeedback : ", JSON.stringify(payload));

    const {
      team: { id: teamId },
      view: { state, private_metadata: user_name }
    } = payload;

    const feedback =
      state.values[FEEDBACK_DESCRIPTION][FEEDBACK_DESCRIPTION_VALUE].value;

    const channel =
      state.values[FEEDBACK_CHANNEL][FEEDBACK_CHANNEL_VALUE]
        .selected_conversation;

    const isAnonymous = state.values[FEEDBACK_IS_ANONYMOUS][
      FEEDBACK_IS_ANONYMOUS_VALUE
    ].selected_options.length
      ? true // eslint-disable-line
      : false;

    logger.debug("feedback : ", feedback);
    logger.debug("channel : ", channel);
    logger.debug("isAnonymous : ", isAnonymous);

    const template = createFeedbackSubmittedTemplate(
      user_name,
      feedback,
      isAnonymous
    );

    await addFeedback({
      slackUserName: user_name,
      teamId,
      feedback,
      isAnonymous
    });

    return await slackPostMessageToChannel(channel, teamId, template, true);
  } catch (error) {
    logger.error("processFeedback() -> error : ", error);
  }
};

module.exports = { processFeedback };
