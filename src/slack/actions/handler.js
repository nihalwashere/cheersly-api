const {
  SLACK_ACTIONS: { POLL_OPTION_SUBMITTED }
} = require("../../global/constants");
const { handlePollOptionSubmitted } = require("./poll-option-submitted");
const logger = require("../../global/logger");

const actionsMapper = async (payload) => {
  try {
    const mapper = {
      [POLL_OPTION_SUBMITTED]: async () =>
        await handlePollOptionSubmitted(payload)
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