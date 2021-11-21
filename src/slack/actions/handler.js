const {
  SLACK_ACTIONS: { POLL_OPTION_SUBMITTED, CUSTOMER_FEEDBACK, SAY_CHEERS },
  ACTION_IDS: { PAPER_PLAYED }
} = require("../../global/constants");
const { handlePollOptionSubmitted } = require("./poll-option-submitted");
const { handleShareFeedback } = require("./share-feedback");
const { handleSayCheers } = require("./say-cheers");
const { handleStonePaperScissors } = require("./stone-paper-scissors");
const logger = require("../../global/logger");

const actionsMapper = async (payload) => {
  try {
    const mapper = {
      [POLL_OPTION_SUBMITTED]: async () =>
        await handlePollOptionSubmitted(payload),
      [CUSTOMER_FEEDBACK]: async () => await handleShareFeedback(payload),
      [SAY_CHEERS]: async () => await handleSayCheers(payload),
      [PAPER_PLAYED]: async () => handleStonePaperScissors(payload)
    };

    const applyMapper = mapper[payload.actions[0].action_id];
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
