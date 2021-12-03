const {
  BLOCK_IDS: { ICEBREAKER_QUESTION_CHANNEL },
  ACTION_IDS: { ICEBREAKER_QUESTION_CHANNEL_VALUE },
} = require("../../../global/constants");
const IceBreakerQuestionsModel = require("../../../mongo/models/IceBreakerQuestions");
const { slackPostMessageToChannel } = require("../../api");
const { createIcebreakerQuestionSubmittedTemplate } = require("./template");
const logger = require("../../../global/logger");

const processStartIcebreakerQuestion = async payload => {
  try {
    const {
      user: { id: userId },
      team: { id: teamId },
      view: { state },
    } = payload;

    const gameChannel =
      state.values[ICEBREAKER_QUESTION_CHANNEL][
        ICEBREAKER_QUESTION_CHANNEL_VALUE
      ].selected_conversation;

    const iceBreakerQuestion = await IceBreakerQuestionsModel.aggregate().sample(
      1
    );

    logger.debug("iceBreakerQuestion : ", iceBreakerQuestion);

    await slackPostMessageToChannel(
      gameChannel,
      teamId,
      createIcebreakerQuestionSubmittedTemplate(
        userId,
        iceBreakerQuestion[0].question
      )
    );
  } catch (error) {
    logger.error("processStartIcebreakerQuestion() -> error : ", error);
  }
};

module.exports = { processStartIcebreakerQuestion };
