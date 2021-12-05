const { nanoid } = require("nanoid");
const ThisOrThatModel = require("../../../mongo/models/ThisOrThat");
const ThisOrThatQuestionsModel = require("../../../mongo/models/ThisOrThatQuestions");
const { slackPostMessageToChannel } = require("../../api");
const {
  BLOCK_IDS: { THIS_OR_THAT_CHANNEL },
  ACTION_IDS: { THIS_OR_THAT_CHANNEL_VALUE },
  SLACK_ERROR: { CHANNEL_NOT_FOUND },
} = require("../../../global/constants");
const { createThisOrThatSubmittedTemplate } = require("./template");
const { createNotInChannelTemplate } = require("../../templates");
const logger = require("../../../global/logger");

const processStartThisOrThat = async payload => {
  try {
    const {
      user: { id: userId },
      team: { id: teamId },
      view: { state },
    } = payload;

    const gameChannel =
      state.values[THIS_OR_THAT_CHANNEL][THIS_OR_THAT_CHANNEL_VALUE]
        .selected_conversation;

    const gameId = nanoid(10);

    const thisOrThatQuestion = await ThisOrThatQuestionsModel.aggregate().sample(
      1
    );

    const blocks = createThisOrThatSubmittedTemplate(
      userId,
      gameId,
      thisOrThatQuestion[0]
    );

    const response = await slackPostMessageToChannel(
      gameChannel,
      teamId,
      blocks
    );

    if (response && response.ok) {
      await new ThisOrThatModel({
        teamId,
        gameId,
        question: thisOrThatQuestion[0],
        blocks,
        messageTimestamp: response.ts,
      }).save();
    }

    if (response && !response.ok && response.error === CHANNEL_NOT_FOUND) {
      return {
        push: true,
        view: createNotInChannelTemplate(),
      };
    }
  } catch (error) {
    logger.error("processStartThisOrThat() -> error : ", error);
  }
};

module.exports = { processStartThisOrThat };
