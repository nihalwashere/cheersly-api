const { openModal } = require("../../api");
const { createIntroduceToTeamView } = require("./template");
const {
  VIEW_SUBMISSIONS: { INTRODUCE_TO_TEAM },
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const handleIntroduceToTeam = async payload => {
  try {
    const {
      trigger_id,
      team: { id: teamId },
    } = payload;

    await openModal(
      teamId,
      trigger_id,
      createIntroduceToTeamView(INTRODUCE_TO_TEAM)
    );
  } catch (error) {
    logger.error("handleIntroduceToTeam() -> error : ", error);
  }
};

module.exports = { handleIntroduceToTeam };
