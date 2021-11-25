const { nanoid } = require("nanoid");
const TopicsModel = require("../../../mongo/models/Topics");
const InterestsModel = require("../../../mongo/models/Interests");
const {
  BLOCK_IDS: { NEW_INTEREST },
  ACTION_IDS: { NEW_INTEREST_VALUE }
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const processAddNewInterest = async (payload) => {
  try {
    logger.info("processAddNewInterest");

    const {
      user: { id: userId },
      team: { id: teamId },
      view: { state }
    } = payload;

    const newInterest = state.values[NEW_INTEREST][NEW_INTEREST_VALUE].value;

    const topicId = nanoid(10);
    const topic = await TopicsModel.findOne({ teamId });
    const interest = await InterestsModel.findOne({ teamId, userId });

    if (topic) {
      // update topics for team
      const { topics } = topic;

      topics.push({ id: topicId, value: newInterest });

      await TopicsModel.updateOne({ teamId }, { $set: { topics } });
    } else {
      // create new topic record for team
      await new TopicsModel({
        teamId,
        topics: [{ id: topicId, value: newInterest }]
      }).save();
    }

    if (interest) {
      // update interests for user
      const { interests } = interest;

      interests.push({ id: topicId, value: newInterest });

      await InterestsModel.updateOne(
        { teamId, userId },
        { $set: { interests } }
      );
    } else {
      // create new interest record for user
      await new InterestsModel({
        teamId,
        userId,
        interests: [{ id: topicId, value: newInterest }]
      }).save();
    }

    logger.debug("newInterest : ", newInterest);
  } catch (error) {
    logger.error("processAddNewInterest() -> error : ", error);
  }
};

module.exports = { processAddNewInterest };
