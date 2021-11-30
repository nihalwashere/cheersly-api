const { nanoid } = require("nanoid");
const ThisOrThatModel = require("../../../mongo/models/ThisOrThat");
const { slackPostMessageToChannel } = require("../../api");
const {
  BLOCK_IDS: { THIS_OR_THAT_CHANNEL },
  ACTION_IDS: { THIS_OR_THAT_CHANNEL_VALUE },
} = require("../../../global/constants");
const { ThisOrThatQuestions } = require("../../../data-source/this-or-that");
const { createThisOrThatSubmittedTemplate } = require("./template");
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

    const blocks = createThisOrThatSubmittedTemplate(userId, gameId, [
      ThisOrThatQuestions[0],
    ]);

    const response = await slackPostMessageToChannel(
      gameChannel,
      teamId,
      blocks
    );

    if (response && response.ok) {
      await new ThisOrThatModel({
        teamId,
        gameId,
        question: ThisOrThatQuestions[0],
        blocks,
        messageTimestamp: response.ts,
      }).save();
    }
  } catch (error) {
    logger.error("processStartThisOrThat() -> error : ", error);
  }
};

module.exports = { processStartThisOrThat };
