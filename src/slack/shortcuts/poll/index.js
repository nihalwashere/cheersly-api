const { openModal } = require("../../api");
const { createSubmitAPollTemplate } = require("../../templates");
const {
  VIEW_SUBMISSIONS: { POLL }
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const processPollShortcut = async (payload) => {
  try {
    logger.debug("processPollShortcut");

    const {
      team: { id: teamId },
      user: { id: username },
      trigger_id
    } = payload;

    const viewTemplate = createSubmitAPollTemplate(username, POLL);

    await openModal(teamId, trigger_id, viewTemplate);
  } catch (error) {
    logger.error("processPollShortcut() -> error : ", error);
  }
};

module.exports = { processPollShortcut };
