const { pushViewToModal } = require("../../api");
const { createAddNewTopicView } = require("./template");
const {
  VIEW_SUBMISSIONS: { ADD_NEW_INTEREST }
} = require("../../../global/constants");
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

    await pushViewToModal(
      teamId,
      trigger_id,
      createAddNewTopicView(ADD_NEW_INTEREST)
    );
  } catch (error) {
    logger.error("handleAddNewTopic() -> error : ", error);
  }
};

module.exports = { handleAddNewTopic };
