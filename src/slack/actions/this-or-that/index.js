const { openModal } = require("../../api");
const { createThisOrThatView } = require("./template");
const {
  VIEW_SUBMISSIONS: { START_THIS_OR_THAT },
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const handleThisOrThat = async payload => {
  try {
    const {
      trigger_id,
      team: { id: teamId },
    } = payload;

    await openModal(
      teamId,
      trigger_id,
      createThisOrThatView(START_THIS_OR_THAT)
    );
  } catch (error) {
    logger.error("handleThisOrThat() -> error : ", error);
  }
};

module.exports = { handleThisOrThat };
