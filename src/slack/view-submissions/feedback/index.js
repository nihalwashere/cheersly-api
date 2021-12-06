const {
  BLOCK_IDS: { FEEDBACK_CHANNEL, FEEDBACK_DESCRIPTION, FEEDBACK_IS_ANONYMOUS },
  ACTION_IDS: {
    FEEDBACK_DESCRIPTION_VALUE,
    FEEDBACK_CHANNEL_VALUE,
    FEEDBACK_IS_ANONYMOUS_VALUE,
  },
  SLACK_ERROR: { CHANNEL_NOT_FOUND },
} = require("../../../global/constants");
const { slackPostMessageToChannel } = require("../../api");
const { createFeedbackSubmittedTemplate } = require("./template");
const {
  createNotInChannelTemplate,
  createGamePostedSuccessModalTemplate,
} = require("../../templates");
const { addFeedback } = require("../../../mongo/helper/feedback");
const logger = require("../../../global/logger");

const processFeedback = async payload => {
  try {
    const {
      team: { id: teamId },
      view: { state, private_metadata: user_name },
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

    const response = await slackPostMessageToChannel(
      channel,
      teamId,
      createFeedbackSubmittedTemplate(user_name, feedback, isAnonymous)
    );

    if (response && !response.ok && response.error === CHANNEL_NOT_FOUND) {
      return {
        push: true,
        view: createNotInChannelTemplate(),
      };
    }

    if (response && response.ok) {
      await addFeedback({
        slackUserName: user_name,
        teamId,
        feedback,
        isAnonymous,
      });

      return {
        update: true,
        view: createGamePostedSuccessModalTemplate({
          teamId,
          channelId: channel,
          message: "*Feedback posted successfully!*",
        }),
      };
    }
  } catch (error) {
    logger.error("processFeedback() -> error : ", error);
  }
};

module.exports = { processFeedback };
