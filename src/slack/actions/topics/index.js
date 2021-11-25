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
    const {
      view: { id: viewId },
      user: { id: userId },
      team: { id: teamId },
      actions,
      hash
    } = payload;

    const topicValue = actions[0].value;

    const topicId = actions[0].action_id;

    // add topic to user's interests

    const interest = await InterestsModel.findOne({ teamId, userId });

    let updatedInterest = null;

    if (interest) {
      // update interest for user
      const { interests } = interest;

      interests.push({ id: topicId, value: topicValue });

      updatedInterest = await InterestsModel.findOneAndUpdate(
        { teamId, userId },
        { interests },
        { new: true }
      );
    } else {
      // create new interest for user
      updatedInterest = await new InterestsModel({
        teamId,
        userId,
        interests: [{ id: topicId, value: topicValue }]
      }).save();
    }

    if (updatedInterest) {
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
          updatedInterests
        )
      });
    }
  } catch (error) {
    logger.error("handleTopicsChange() -> error : ", error);
  }
};

module.exports = { handleTopicsChange };
