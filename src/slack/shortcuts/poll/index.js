const { openModal } = require("../../api");
const { createSubmitAPollTemplate } = require("../../templates");
const {
  VIEW_SUBMISSIONS: { POLL }
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const processPollShortcut = async (payload) => {
  try {
    logger.debug("processPollShortcut - payload : ", JSON.stringify(payload));

    const {
      team: { id: teamId },
      user: { id: userId },
      trigger_id
    } = payload;

    // const viewTemplate = createSubmitAPollTemplate(user_name, POLL);
    // await openModal(team_id, trigger_id, viewTemplate);
  } catch (error) {
    logger.error("processPollShortcut() -> error : ", error);
  }
};

module.exports = { processPollShortcut };
