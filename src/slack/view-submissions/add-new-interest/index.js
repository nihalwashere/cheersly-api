const { nanoid } = require("nanoid");
const TopicsModel = require("../../../mongo/models/Topics");
const InterestsModel = require("../../../mongo/models/Interests");
const { updateModal } = require("../../api");
const {
  createInterestsTemplate
} = require("../../commands/interests/template");
const {
  BLOCK_IDS: { NEW_INTEREST },
  ACTION_IDS: { NEW_INTEREST_VALUE },
  VIEW_SUBMISSIONS: { INTERESTS }
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const processAddNewInterest = async (payload) => {
  try {
    const {
      user: { id: userId },
      team: { id: teamId },
      view: { id: viewId, state },
      hash
    } = payload;

    const newInterest = state.values[NEW_INTEREST][NEW_INTEREST_VALUE].value;

    const topicId = nanoid(10);
    const topic = await TopicsModel.findOne({ teamId });
    const interest = await InterestsModel.findOne({ teamId, userId });

    let updatedTopic = null;
    let updatedInterest = null;

    if (topic) {
      // update topics for team
      const { topics } = topic;

      topics.push({ id: topicId, value: newInterest });

      updatedTopic = await TopicsModel.findOneAndUpdate({ teamId }, { topics });
    } else {
      // create new topic record for team
      updatedTopic = await new TopicsModel({
        teamId,
        topics: [{ id: topicId, value: newInterest }]
      }).save();
    }

    if (interest) {
      // update interests for user
      const { interests } = interest;

      interests.push({ id: topicId, value: newInterest });

      updatedInterest = await InterestsModel.findOneAndUpdate(
        { teamId, userId },
        { interests }
      );
    } else {
      // create new interest record for user
      updatedInterest = await new InterestsModel({
        teamId,
        userId,
        interests: [{ id: topicId, value: newInterest }]
      }).save();
    }

    if (updatedTopic && updatedInterest) {
      const { topics: updatedTopics } = updatedTopic;

      const { interests: updatedInterests } = updatedInterest;

      const unSelectedTopics = [];

      updatedTopics.forEach((elem) => {
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
          updatedTopics,
          unSelectedTopics,
          updatedInterests
        )
      });
    }
  } catch (error) {
    logger.error("processAddNewInterest() -> error : ", error);
  }
};

module.exports = { processAddNewInterest };
