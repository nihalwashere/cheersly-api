const { openModal } = require("../../api");
const { createTwoTruthsAndALieView } = require("./template");
const {
  VIEW_SUBMISSIONS: { START_TWO_TRUTHS_AND_A_LIE },
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const handleTwoTruthsAndALie = async payload => {
  try {
    const {
      trigger_id,
      team: { id: teamId },
    } = payload;

    await openModal(
      teamId,
      trigger_id,
      createTwoTruthsAndALieView(START_TWO_TRUTHS_AND_A_LIE)
    );
  } catch (error) {
    logger.error("handleTwoTruthsAndALie() -> error : ", error);
  }
};

module.exports = { handleTwoTruthsAndALie };
