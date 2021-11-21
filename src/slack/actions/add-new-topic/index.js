const { pushViewToModal } = require("../../api");
const { createAddNewTopicView } = require("./template");
const logger = require("../../../global/logger");

const handleAddNewTopic = async (payload) => {
  try {
    logger.info("handleAddNewTopic");

    const {
      trigger_id,
      //   user: { id: userId },
      team: { id: teamId }
      //   channel: { id: channelId },
    } = payload;

    await pushViewToModal(teamId, trigger_id, createAddNewTopicView());
  } catch (error) {
    logger.error("handleAddNewTopic() -> error : ", error);
  }
};

module.exports = { handleAddNewTopic };
