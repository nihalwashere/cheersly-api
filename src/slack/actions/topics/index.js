const InterestsModel = require("../../../mongo/models/Interests");
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

    const topicValue = actions[0].value;
    logger.debug("topicValue : ", topicValue);

    const topicId = actions[0].action_id;
    logger.debug("topicId : ", topicId);

    // add topic to user's interests

    const interest = await InterestsModel.findOne({ teamId, userId });

    const { interests } = interest;

    interests.push({ id: topicId, value: topicValue });

    await InterestsModel.updateOne({ teamId, userId }, { $set: { interests } });
  } catch (error) {
    logger.error("handleTopicsChange() -> error : ", error);
  }
};

module.exports = { handleTopicsChange };
