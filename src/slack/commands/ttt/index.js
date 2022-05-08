const { nanoid } = require("nanoid");
const TicTacToeModel = require("../../../mongo/models/TicTacToe");
const {
  createAllowedOnlyInDMTemplate,
  createPlayTicTacToeTemplate,
} = require("./template");
const { isSubscriptionValidForSlack } = require("../../../utils/common");
const { updateAppHomePublishedForTeam } = require("../../../mongo/helper/user");
const {
  SubscriptionMessageType,
} = require("../../../enums/subscriptionMessageTypes");
const {
  createTrialEndedTemplate,
  createUpgradeSubscriptionTemplate,
} = require("../../templates");
const logger = require("../../../global/logger");

const handleTicTacToeCommand = async (teamId, userId, channelId) => {
  try {
    // /cheers ttt

    if (String(channelId).charAt(0) === "C") {
      // command executed in channel or multi person chat
      return {
        response_type: "ephemeral",
        blocks: createAllowedOnlyInDMTemplate(),
      };
    }

    // verify subscription

    const subscriptionInfo = await isSubscriptionValidForSlack(teamId);

    if (!subscriptionInfo.hasSubscription) {
      await updateAppHomePublishedForTeam(teamId, false);

      if (subscriptionInfo.messageType === SubscriptionMessageType.TRIAL) {
        return {
          response_type: "in_channel",
          blocks: createTrialEndedTemplate(),
        };
      }

      return {
        response_type: "in_channel",
        blocks: createUpgradeSubscriptionTemplate(),
      };
    }

    const gameId = nanoid(10);

    const blocks = createPlayTicTacToeTemplate(userId, gameId);

    await new TicTacToeModel({
      teamId,
      gameId,
      blocks,
    }).save();

    return {
      response_type: "in_channel",
      blocks,
    };
  } catch (error) {
    logger.error("handleTicTacToeCommand() -> error : ", error);
  }
};

const isTTTCommand = text => {
  if (
    String(text)
      .trim()
      .includes("tt")
  ) {
    return true;
  }

  return false;
};

module.exports = { handleTicTacToeCommand, isTTTCommand };
