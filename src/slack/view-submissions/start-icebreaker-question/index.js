const {
  BLOCK_IDS: { ICEBREAKER_QUESTION_CHANNEL },
  ACTION_IDS: { ICEBREAKER_QUESTION_CHANNEL_VALUE },
  SLACK_ERROR: { CHANNEL_NOT_FOUND },
} = require("../../../global/constants");
const IceBreakerQuestionsModel = require("../../../mongo/models/IceBreakerQuestions");
const { slackPostMessageToChannel, updateModal } = require("../../api");
const { createIcebreakerQuestionSubmittedTemplate } = require("./template");
const { createNotInChannelTemplate } = require("../../templates");
const logger = require("../../../global/logger");

const processStartIcebreakerQuestion = async payload => {
  try {
    const {
      user: { id: userId },
      team: { id: teamId },
      view: { id: viewId, hash, state },
    } = payload;

    const gameChannel =
      state.values[ICEBREAKER_QUESTION_CHANNEL][
        ICEBREAKER_QUESTION_CHANNEL_VALUE
      ].selected_conversation;

    const iceBreakerQuestion = await IceBreakerQuestionsModel.aggregate().sample(
      1
    );

    const response = await slackPostMessageToChannel(
      gameChannel,
      teamId,
      createIcebreakerQuestionSubmittedTemplate(
        userId,
        iceBreakerQuestion[0].question
      )
    );

    if (response && !response.ok && response.error === CHANNEL_NOT_FOUND) {
      await updateModal({
        teamId,
        viewId,
        hash,
        view: createNotInChannelTemplate(),
      });
    }
  } catch (error) {
    logger.error("processStartIcebreakerQuestion() -> error : ", error);
  }
};

module.exports = { processStartIcebreakerQuestion };
