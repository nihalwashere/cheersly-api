const { nanoid } = require("nanoid");
const {
  BLOCK_IDS: {
    TWO_TRUTHS_CHANNEL,
    TWO_TRUTHS_TRUTH_ONE,
    TWO_TRUTHS_TRUTH_TWO,
    TWO_TRUTHS_LIE,
  },
  ACTION_IDS: {
    TWO_TRUTHS_CHANNEL_VALUE,
    TWO_TRUTHS_TRUTH_ONE_VALUE,
    TWO_TRUTHS_TRUTH_TWO_VALUE,
    TWO_TRUTHS_LIE_VALUE,
  },
  SLACK_ERROR: { CHANNEL_NOT_FOUND },
} = require("../../../global/constants");
const TwoTruthsAndALieModel = require("../../../mongo/models/TwoTruthsAndALie");
const { slackPostMessageToChannel } = require("../../api");
const { createTwoTruthsAndALieSubmittedTemplate } = require("./template");
const {
  createNotInChannelTemplate,
  createGamePostedSuccessModalTemplate,
} = require("../../templates");
const { shuffle } = require("../../../utils/common");
const logger = require("../../../global/logger");

const processStartTwoTruthsAndALie = async payload => {
  try {
    const {
      user: { id: userId },
      team: { id: teamId },
      view: { state },
    } = payload;

    const gameChannel =
      state.values[TWO_TRUTHS_CHANNEL][TWO_TRUTHS_CHANNEL_VALUE]
        .selected_conversation;

    const truthOne =
      state.values[TWO_TRUTHS_TRUTH_ONE][TWO_TRUTHS_TRUTH_ONE_VALUE].value;

    const truthTwo =
      state.values[TWO_TRUTHS_TRUTH_TWO][TWO_TRUTHS_TRUTH_TWO_VALUE].value;

    const lie = state.values[TWO_TRUTHS_LIE][TWO_TRUTHS_LIE_VALUE].value;

    const gameId = nanoid(10);

    const statementOne = {
      id: nanoid(10),
      value: truthOne,
    };

    const statementTwo = {
      id: nanoid(10),
      value: truthTwo,
    };

    const statementThree = {
      id: nanoid(10),
      value: lie,
    };

    const blocks = createTwoTruthsAndALieSubmittedTemplate({
      userId,
      gameId,
      statements: shuffle([statementOne, statementTwo, statementThree]),
    });

    const response = await slackPostMessageToChannel(
      gameChannel,
      teamId,
      blocks
    );

    if (response && !response.ok && response.error === CHANNEL_NOT_FOUND) {
      return {
        push: true,
        view: createNotInChannelTemplate(),
      };
    }

    if (response && response.ok) {
      await new TwoTruthsAndALieModel({
        teamId,
        gameId,
        statementOne,
        statementTwo,
        statementThree,
        lie: { ...statementThree },
        messageTimestamp: response.ts,
        blocks,
      }).save();

      return {
        update: true,
        view: createGamePostedSuccessModalTemplate({
          teamId,
          channelId: gameChannel,
          message: "*Two truths and a lie posted successfully!*",
        }),
      };
    }
  } catch (error) {
    logger.error("processStartTwoTruthsAndALie() -> error : ", error);
  }
};

module.exports = { processStartTwoTruthsAndALie };
