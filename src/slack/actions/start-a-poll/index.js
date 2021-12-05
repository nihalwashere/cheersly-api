const { openModal } = require("../../api");
const { createSubmitAPollTemplate } = require("../../templates");
const {
  VIEW_SUBMISSIONS: { POLL },
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const handleStartAPoll = async payload => {
  try {
    const {
      trigger_id,
      user: { name: slackUserName },
      team: { id: teamId },
    } = payload;

    await openModal(
      teamId,
      trigger_id,
      createSubmitAPollTemplate(slackUserName, POLL)
    );
  } catch (error) {
    logger.error("handleStartAPoll() -> error : ", error);
  }
};

module.exports = { handleStartAPoll };
