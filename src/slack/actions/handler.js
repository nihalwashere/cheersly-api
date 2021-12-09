const {
  SLACK_ACTIONS: {
    POLL_OPTION_SUBMITTED,
    CUSTOMER_FEEDBACK,
    INTRODUCE_TO_TEAM,
    SAY_CHEERS,
    START_A_POLL,
    SHARE_FEEDBACK_WITH_TEAM,
    ADD_NEW_TOPIC,
    THIS_OR_THAT,
    ICEBREAKER_QUESTION,
    TIC_TAC_TOE_HELP,
    STONE_PAPER_SCISSORS_HELP,
  },
  BLOCK_IDS: {
    STONE_PAPER_SCISSORS,
    TIC_TAC_TOE_ROW_1,
    TIC_TAC_TOE_ROW_2,
    TIC_TAC_TOE_ROW_3,
    TOPICS_CHANGE,
    INTERESTS_CHANGE,
    THIS_OR_THAT_PLAYED,
  },
} = require("../../global/constants");
const { handlePollOptionSubmitted } = require("./poll-option-submitted");
const { handleCustomerFeedback } = require("./customer-feedback");
const { handleIntroduceToTeam } = require("./introduce-to-team");
const { handleSayCheers } = require("./say-cheers");
const { handleStartAPoll } = require("./start-a-poll");
const { handleShareFeedbackWithTeam } = require("./share-feedback-with-team");
const { handleStonePaperScissors } = require("./stone-paper-scissors");
const { handleTicTacToe } = require("./tic-tac-toe");
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
      [CUSTOMER_FEEDBACK]: () => handleCustomerFeedback(payload),
      [INTRODUCE_TO_TEAM]: () => handleIntroduceToTeam(payload),
      [SAY_CHEERS]: () => handleSayCheers(payload),
      [START_A_POLL]: () => handleStartAPoll(payload),
      [SHARE_FEEDBACK_WITH_TEAM]: () => handleShareFeedbackWithTeam(payload),
      [ADD_NEW_TOPIC]: () => handleAddNewTopic(payload),
      [THIS_OR_THAT]: () => handleThisOrThat(payload),
      [ICEBREAKER_QUESTION]: () => handleIcebreakerQuestion(payload),
      [TIC_TAC_TOE_HELP]: () => handleTicTacToeHelp(payload),
      [STONE_PAPER_SCISSORS_HELP]: () => handleStonePaperScissorsHelp(payload),
    };

    const blockIdMapper = {
      [STONE_PAPER_SCISSORS]: () => handleStonePaperScissors(payload),
      [TIC_TAC_TOE_ROW_1]: () => handleTicTacToe(payload),
      [TIC_TAC_TOE_ROW_2]: () => handleTicTacToe(payload),
      [TIC_TAC_TOE_ROW_3]: () => handleTicTacToe(payload),
      [TOPICS_CHANGE]: () => handleTopicsChange(payload),
      [INTERESTS_CHANGE]: () => handleInterestsChange(payload),
      [THIS_OR_THAT_PLAYED]: () => handleThisOrThatPlayed(payload),
    };

    let applyMapper = null;

    if (
      payload.actions[0].block_id &&
      (payload.actions[0].block_id === STONE_PAPER_SCISSORS ||
        payload.actions[0].block_id === TIC_TAC_TOE_ROW_1 ||
        payload.actions[0].block_id === TIC_TAC_TOE_ROW_2 ||
        payload.actions[0].block_id === TIC_TAC_TOE_ROW_3 ||
        payload.actions[0].block_id === TOPICS_CHANGE ||
        payload.actions[0].block_id === INTERESTS_CHANGE ||
        payload.actions[0].block_id === THIS_OR_THAT_PLAYED)
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
      return await actionsMapper(payload);
    }
  } catch (error) {
    logger.error("actionsHandler() -> error : ", error);
  }
};

module.exports = { actionsHandler };
