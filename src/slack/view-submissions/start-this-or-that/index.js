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

    const question1 =
      ThisOrThatQuestions[
        Math.floor(Math.random() * ThisOrThatQuestions.length)
      ];

    const question2 =
      ThisOrThatQuestions[
        Math.floor(Math.random() * ThisOrThatQuestions.length)
      ];

    const question3 =
      ThisOrThatQuestions[
        Math.floor(Math.random() * ThisOrThatQuestions.length)
      ];

    await slackPostMessageToChannel(
      gameChannel,
      teamId,
      createThisOrThatSubmittedTemplate(userId, [
        question1,
        question2,
        question3,
      ])
    );
  } catch (error) {
    logger.error("processStartThisOrThat() -> error : ", error);
  }
};

module.exports = { processStartThisOrThat };
