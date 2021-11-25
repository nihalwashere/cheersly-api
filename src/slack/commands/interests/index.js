const TopicsModel = require("../../../mongo/models/Topics");
const InterestsModel = require("../../../mongo/models/Interests");
const { openModal } = require("../../api");
const { createInterestsTemplate } = require("./template");
const {
  VIEW_SUBMISSIONS: { INTERESTS }
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const handleInterestsCommand = async (teamId, userId, trigger_id) => {
  try {
    // /cheers interests

    const topic = await TopicsModel.findOne({ teamId });
    const interest = await InterestsModel.findOne({ teamId, userId });

    let topics = [];
    let interests = [];

    if (topic) {
      topics = topic.topics;
    }

    if (interest) {
      interests = interest.interests;
    }

    const unSelectedTopics = [];

    topics.forEach((elem) => {
      if (!interests.some((item) => item.id === elem.id)) {
        unSelectedTopics.push(elem);
      }
    });

    logger.debug("topics : ", topics);
    logger.debug("interests : ", interests);
    logger.debug("unSelectedTopics : ", unSelectedTopics);

    await openModal(
      teamId,
      trigger_id,
      createInterestsTemplate(INTERESTS, topics, unSelectedTopics, interests)
    );
  } catch (error) {
    logger.error("handleInterestsCommand() -> error : ", error);
  }
};

const isInterestsCommand = (text) => {
  if (String(text).trim().includes("in")) {
    return true;
  }

  return false;
};

module.exports = { isInterestsCommand, handleInterestsCommand };
