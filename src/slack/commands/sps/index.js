const { nanoid } = require("nanoid");
const StonePaperScissorsModel = require("../../../mongo/models/StonePaperScissors");
const {
  createAllowedOnlyInDMTemplate,
  createPlayStonePaperScissorsTemplate,
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

const handleStonePaperScissorsCommand = async (
  team_id,
  user_id,
  channel_id
) => {
  try {
    // /cheers sps

    if (String(channel_id).charAt(0) === "C") {
      // command executed in channel or multi person chat
      return {
        response_type: "ephemeral",
        blocks: createAllowedOnlyInDMTemplate(),
      };
    }

    // verify subscription

    const subscriptionInfo = await isSubscriptionValidForSlack(team_id);

    if (!subscriptionInfo.hasSubscription) {
      await updateAppHomePublishedForTeam(team_id, false);

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

    const blocks = createPlayStonePaperScissorsTemplate(user_id, gameId);

    await new StonePaperScissorsModel({
      teamId: team_id,
      gameId,
      blocks,
    }).save();

    return {
      response_type: "in_channel",
      blocks,
    };
  } catch (error) {
    logger.error("handleStonePaperScissorsCommand() -> error : ", error);
  }
};

const isSPSCommand = text => {
  if (
    String(text)
      .trim()
      .includes("sp")
  ) {
    return true;
  }

  return false;
};

module.exports = { handleStonePaperScissorsCommand, isSPSCommand };
