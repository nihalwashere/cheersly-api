const { openModal } = require("../../api");
const { createIcebreakerQuestionView } = require("./template");
const {
  VIEW_SUBMISSIONS: { START_ICEBREAKER_QUESTION },
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const handleIcebreakerQuestion = async payload => {
  try {
    const {
      trigger_id,
      //   user: { id: userId },
      team: { id: teamId },
      //   channel: { id: channelId },
    } = payload;

    await openModal(
      teamId,
      trigger_id,
      createIcebreakerQuestionView(START_ICEBREAKER_QUESTION)
    );
  } catch (error) {
    logger.error("handleIcebreakerQuestion() -> error : ", error);
  }
};

module.exports = { handleIcebreakerQuestion };
