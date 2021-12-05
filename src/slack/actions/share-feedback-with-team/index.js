const { openModal } = require("../../api");
const { createSubmitAFeedbackTemplate } = require("../../templates");
const {
  VIEW_SUBMISSIONS: { FEEDBACK },
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const handleShareFeedbackWithTeam = async payload => {
  try {
    const {
      trigger_id,
      user: { name: slackUserName },
      team: { id: teamId },
    } = payload;

    await openModal(
      teamId,
      trigger_id,
      createSubmitAFeedbackTemplate(slackUserName, FEEDBACK)
    );
  } catch (error) {
    logger.error("handleShareFeedbackWithTeam() -> error : ", error);
  }
};

module.exports = { handleShareFeedbackWithTeam };
