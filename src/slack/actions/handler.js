const {
  SLACK_ACTIONS: {
    POLL_OPTION_SUBMITTED,
    CUSTOMER_FEEDBACK,
    SAY_CHEERS,
    ADD_NEW_TOPIC
  },
  BLOCK_IDS: { STONE_PAPER_SCISSORS, TOPICS_CHANGE, INTERESTS_CHANGE }
} = require("../../global/constants");
const { handlePollOptionSubmitted } = require("./poll-option-submitted");
const { handleShareFeedback } = require("./share-feedback");
const { handleSayCheers } = require("./say-cheers");
const { handleStonePaperScissors } = require("./stone-paper-scissors");
const { handleAddNewTopic } = require("./add-new-topic");
const { handleTopicsChange } = require("./topics");
const { handleInterestsChange } = require("./interests");
const logger = require("../../global/logger");

const actionsMapper = async (payload) => {
  try {
    const actionIdMapper = {
      [POLL_OPTION_SUBMITTED]: () => handlePollOptionSubmitted(payload),
      [CUSTOMER_FEEDBACK]: () => handleShareFeedback(payload),
      [SAY_CHEERS]: () => handleSayCheers(payload),
      [ADD_NEW_TOPIC]: () => handleAddNewTopic(payload)
    };

    const blockIdMapper = {
      [STONE_PAPER_SCISSORS]: () => handleStonePaperScissors(payload),
      [TOPICS_CHANGE]: () => handleTopicsChange(payload),
      [INTERESTS_CHANGE]: () => handleInterestsChange(payload)
    };

    let applyMapper = null;

    if (
      payload.actions[0].block_id &&
      (payload.actions[0].block_id === STONE_PAPER_SCISSORS ||
        payload.actions[0].block_id === TOPICS_CHANGE ||
        payload.actions[0].block_id === INTERESTS_CHANGE)
    ) {
      applyMapper = blockIdMapper[payload.actions[0].block_id];
    } else {
      applyMapper = actionIdMapper[payload.actions[0].action_id];
    }

    return applyMapper ? applyMapper() : null;
  } catch (error) {
    logger.error("actionsMapper() -> error : ", error);
  }
};

const actionsHandler = async (payload) => {
  try {
    logger.info("actionsHandler");

    const { actions } = payload;

    if (actions.length && actions[0].action_id) {
      await actionsMapper(payload);
    }
  } catch (error) {
    logger.error("actionsHandler() -> error : ", error);
  }
};

module.exports = { actionsHandler };
