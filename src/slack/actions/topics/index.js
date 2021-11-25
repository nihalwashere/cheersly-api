const logger = require("../../../global/logger");

const handleTopicsChange = async (payload) => {
  try {
    logger.info("handleTopicsChange");

    const {
      //   trigger_id,
      user: { id: userId },
      team: { id: teamId },
      actions
    } = payload;

    const topic = actions[0].value;
    logger.debug("topic : ", topic);

    const topicId = actions[0].action_id;
    logger.debug("topicId : ", topicId);
  } catch (error) {
    logger.error("handleTopicsChange() -> error : ", error);
  }
};

module.exports = { handleTopicsChange };
