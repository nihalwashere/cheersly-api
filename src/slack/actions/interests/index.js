const InterestsModel = require("../../../mongo/models/Interests");
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

    const interestValue = actions[0].value;
    logger.debug("interestValue : ", interestValue);

    const interestId = actions[0].action_id;
    logger.debug("interestId : ", interestId);

    // remove topic from user's interests

    const interest = await InterestsModel.findOne({ teamId, userId });

    const { interests } = interest;

    const newInterests = interests.filter((elem) => elem.id !== interestId);

    await InterestsModel.updateOne(
      { teamId, userId },
      { $set: { interests: newInterests } }
    );
  } catch (error) {
    logger.error("handleInterestsChange() -> error : ", error);
  }
};

module.exports = { handleInterestsChange };
