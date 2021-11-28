const {
  BLOCK_IDS: { SELECT_ICEBREAKER_QUESTION_CHANNEL },
  ACTION_IDS: { SELECT_ICEBREAKER_QUESTION_CHANNEL_VALUE },
} = require("../../../global/constants");
const { IceBreakerQuestions } = require("../../../data-source/ice-breaker");
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
      state.values[SELECT_ICEBREAKER_QUESTION_CHANNEL][
        SELECT_ICEBREAKER_QUESTION_CHANNEL_VALUE
      ].value;

    await slackPostMessageToChannel(
      gameChannel,
      teamId,
      createIcebreakerQuestionSubmittedTemplate(
        userId,
        IceBreakerQuestions[
          Math.floor(Math.random() * IceBreakerQuestions.length)
        ].question
      )
    );
  } catch (error) {
    logger.error("processStartIcebreakerQuestion() -> error : ", error);
  }
};

module.exports = { processStartIcebreakerQuestion };
