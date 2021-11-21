const { openModal } = require("../../api");
const { createInterestsTemplate } = require("./template");
const {
  VIEW_SUBMISSIONS: { INTERESTS }
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const handleInterestsCommand = async (team_id, trigger_id) => {
  try {
    // /cheers interests

    await openModal(team_id, trigger_id, createInterestsTemplate(INTERESTS));
  } catch (error) {
    logger.error("handleInterestsCommand() -> error : ", error);
  }
};

const isInterestsCommand = (text) => {
  if (String(text).trim().includes("in")) {
    return true;
  }

  return false;
};

module.exports = { isInterestsCommand, handleInterestsCommand };
