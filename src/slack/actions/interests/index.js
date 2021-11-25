const TopicsModel = require("../../../mongo/models/Topics");
const InterestsModel = require("../../../mongo/models/Interests");
const { updateModal } = require("../../api");
const {
  createInterestsTemplate
} = require("../../commands/interests/template");
const {
  VIEW_SUBMISSIONS: { INTERESTS }
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const handleInterestsChange = async (payload) => {
  try {
    logger.info("handleInterestsChange");

    const {
      view: { id: viewId },
      user: { id: userId },
      team: { id: teamId },
      actions,
      hash
    } = payload;

    const interestValue = actions[0].value;
    logger.debug("interestValue : ", interestValue);

    const interestId = actions[0].action_id;
    logger.debug("interestId : ", interestId);

    // remove topic from user's interests

    const interest = await InterestsModel.findOne({ teamId, userId });

    const { interests } = interest;

    const newInterests = interests.filter((elem) => elem.id !== interestId);

    const updatedInterest = await InterestsModel.updateOne(
      { teamId, userId },
      { $set: { interests: newInterests } },
      { new: true }
    );

    const { interests: updatedInterests } = updatedInterest;

    const topic = await TopicsModel.findOne({ teamId });

    const { topics } = topic;

    const unSelectedTopics = [];

    topics.forEach((elem) => {
      if (!updatedInterests.some((item) => item.id === elem.id)) {
        unSelectedTopics.push(elem);
      }
    });

    await updateModal({
      teamId,
      viewId,
      hash,
      view: createInterestsTemplate(
        INTERESTS,
        topics,
        unSelectedTopics,
        interests
      )
    });
  } catch (error) {
    logger.error("handleInterestsChange() -> error : ", error);
  }
};

module.exports = { handleInterestsChange };
