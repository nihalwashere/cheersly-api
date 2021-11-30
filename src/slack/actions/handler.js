const {
  SLACK_ACTIONS: {
    POLL_OPTION_SUBMITTED,
    CUSTOMER_FEEDBACK,
    SAY_CHEERS,
    ADD_NEW_TOPIC,
    THIS_OR_THAT,
    ICEBREAKER_QUESTION,
    TIC_TAC_TOE_HELP,
    STONE_PAPER_SCISSORS_HELP,
  },
  BLOCK_IDS: {
    STONE_PAPER_SCISSORS,
    TOPICS_CHANGE,
    INTERESTS_CHANGE,
    THIS_OR_THAT_PLAYED_SET_ONE,
    THIS_OR_THAT_PLAYED_SET_TWO,
    THIS_OR_THAT_PLAYED_SET_THREE,
  },
} = require("../../global/constants");
const { handlePollOptionSubmitted } = require("./poll-option-submitted");
const { handleShareFeedback } = require("./share-feedback");
const { handleSayCheers } = require("./say-cheers");
const { handleStonePaperScissors } = require("./stone-paper-scissors");
const { handleAddNewTopic } = require("./add-new-topic");
const { handleTopicsChange } = require("./topics");
const { handleInterestsChange } = require("./interests");
const { handleThisOrThat } = require("./this-or-that");
const { handleIcebreakerQuestion } = require("./icebreaker-question");
const { handleTicTacToeHelp } = require("./tic-tac-toe-help");
const { handleStonePaperScissorsHelp } = require("./stone-paper-scissors-help");
const { handleThisOrThatPlayed } = require("./this-or-that-play");
const logger = require("../../global/logger");

const actionsMapper = async payload => {
  try {
    const actionIdMapper = {
      [POLL_OPTION_SUBMITTED]: () => handlePollOptionSubmitted(payload),
      [CUSTOMER_FEEDBACK]: () => handleShareFeedback(payload),
      [SAY_CHEERS]: () => handleSayCheers(payload),
      [ADD_NEW_TOPIC]: () => handleAddNewTopic(payload),
      [THIS_OR_THAT]: () => handleThisOrThat(payload),
      [ICEBREAKER_QUESTION]: () => handleIcebreakerQuestion(payload),
      [TIC_TAC_TOE_HELP]: () => handleTicTacToeHelp(payload),
      [STONE_PAPER_SCISSORS_HELP]: () => handleStonePaperScissorsHelp(payload),
    };

    const blockIdMapper = {
      [STONE_PAPER_SCISSORS]: () => handleStonePaperScissors(payload),
      [TOPICS_CHANGE]: () => handleTopicsChange(payload),
      [INTERESTS_CHANGE]: () => handleInterestsChange(payload),
      [THIS_OR_THAT_PLAYED_SET_ONE]: () =>
        handleThisOrThatPlayed(payload, THIS_OR_THAT_PLAYED_SET_ONE),
      [THIS_OR_THAT_PLAYED_SET_TWO]: () =>
        handleThisOrThatPlayed(payload, THIS_OR_THAT_PLAYED_SET_TWO),
      [THIS_OR_THAT_PLAYED_SET_THREE]: () =>
        handleThisOrThatPlayed(payload, THIS_OR_THAT_PLAYED_SET_THREE),
    };

    let applyMapper = null;

    if (
      payload.actions[0].block_id &&
      (payload.actions[0].block_id === STONE_PAPER_SCISSORS ||
        payload.actions[0].block_id === TOPICS_CHANGE ||
        payload.actions[0].block_id === INTERESTS_CHANGE ||
        payload.actions[0].block_id.includes("THIS_OR_THAT_PLAYED"))
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

const actionsHandler = async payload => {
  try {
    const { actions } = payload;

    if (actions.length && actions[0].action_id) {
      await actionsMapper(payload);
    }
  } catch (error) {
    logger.error("actionsHandler() -> error : ", error);
  }
};

module.exports = { actionsHandler };
