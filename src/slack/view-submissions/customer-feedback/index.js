const {
  BLOCK_IDS: { SELECT_OPTION_FOR_FEEDBACK, CUSTOMER_FEEDBACK_DESCRIPTION },
  ACTION_IDS: {
    SELECTED_OPTION_FOR_FEEDBACK,
    CUSTOMER_FEEDBACK_DESCRIPTION_TEXT,
  },
} = require("../../../global/constants");
const { createFeedbackSubmissionSuccessTemplate } = require("./template");
const {
  addCustomerFeedback,
} = require("../../../mongo/helper/customerFeedback");
const { slackPostMessageToChannel, postInternalMessage } = require("../../api");
const { getUserDataBySlackUserId } = require("../../../mongo/helper/user");
const { createInternalFeedbackTemplate } = require("../../templates");
const {
  INTERNAL_SLACK_TEAM_ID,
  INTERNAL_SLACK_CHANNEL_ID,
} = require("../../../global/config");
const logger = require("../../../global/logger");

const processCustomerFeedback = async payload => {
  try {
    logger.info("processCustomerFeedback");
    const {
      user: { id: slackUserId },
      team: { id: teamId },
      view: { state },
    } = payload;

    const regarding =
      state.values[SELECT_OPTION_FOR_FEEDBACK][SELECTED_OPTION_FOR_FEEDBACK]
        .selected_option.value;

    const description =
      state.values[CUSTOMER_FEEDBACK_DESCRIPTION][
        CUSTOMER_FEEDBACK_DESCRIPTION_TEXT
      ].value;

    // save feedback to database
    await addCustomerFeedback({
      slackUserId,
      teamId,
      regarding,
      description: description || "",
    });

    const template = createFeedbackSubmissionSuccessTemplate();

    // post message to slack
    await slackPostMessageToChannel(slackUserId, teamId, template, true);

    const userData = await getUserDataBySlackUserId(slackUserId);

    if (userData) {
      const { name } = userData.slackUserData;

      const internalFeedbackTemplate = createInternalFeedbackTemplate(
        name,
        regarding,
        description || ""
      );

      await postInternalMessage(
        INTERNAL_SLACK_TEAM_ID,
        INTERNAL_SLACK_CHANNEL_ID,
        internalFeedbackTemplate
      );
    }
  } catch (error) {
    logger.error("processCustomerFeedback() -> error : ", error);
  }
};

module.exports = { processCustomerFeedback };
