const {
  VIEW_SUBMISSIONS: { ADD_NEW_INTEREST }
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const handleInterestsChange = async (payload) => {
  try {
    logger.info("handleInterestsChange");

    const {
      //   trigger_id,
      user: { id: userId },
      team: { id: teamId },
      actions
    } = payload;

    const interest = actions[0].value;
    logger.debug("interest : ", interest);

    const interestId = actions[0].action_id;
    logger.debug("interestId : ", interestId);

    // remove topic from user's interests
  } catch (error) {
    logger.error("handleInterestsChange() -> error : ", error);
  }
};

module.exports = { handleInterestsChange };
