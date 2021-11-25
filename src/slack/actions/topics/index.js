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

const handleTopicsChange = async (payload) => {
  try {
    logger.info("handleTopicsChange");

    const {
      view: { id: viewId },
      user: { id: userId },
      team: { id: teamId },
      actions,
      hash
    } = payload;

    const topicValue = actions[0].value;
    logger.debug("topicValue : ", topicValue);

    const topicId = actions[0].action_id;
    logger.debug("topicId : ", topicId);

    // add topic to user's interests

    const interest = await InterestsModel.findOne({ teamId, userId });

    if (interest) {
      // update interest for user
      const { interests } = interest;

      interests.push({ id: topicId, value: topicValue });

      const updatedInterest = await InterestsModel.findOneAndUpdate(
        { teamId, userId },
        { interests }
      );

      logger.debug("updatedInterest : ", updatedInterest);
    } else {
      // create new interest for user
      const newInterest = await new InterestsModel({
        teamId,
        userId,
        interests: [{ id: topicId, value: topicValue }]
      }).save();

      logger.debug("newInterest : ", newInterest);
    }

    // const { interests: updatedInterests } = updatedInterest;

    // const topic = await TopicsModel.findOne({ teamId });

    // const { topics } = topic;

    // const unSelectedTopics = [];

    // topics.forEach((elem) => {
    //   if (!updatedInterests.some((item) => item.id === elem.id)) {
    //     unSelectedTopics.push(elem);
    //   }
    // });

    // await updateModal({
    //   teamId,
    //   viewId,
    //   hash,
    //   view: createInterestsTemplate(
    //     INTERESTS,
    //     topics,
    //     unSelectedTopics,
    //     updatedInterests
    //   )
    // });
  } catch (error) {
    logger.error("handleTopicsChange() -> error : ", error);
  }
};

module.exports = { handleTopicsChange };
