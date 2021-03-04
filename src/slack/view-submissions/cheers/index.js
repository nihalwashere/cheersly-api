const {
  BLOCK_IDS: {
    SUBMIT_CHEERS_TO_USERS,
    SUBMIT_CHEERS_TO_CHANNEL,
    SUBMIT_CHEERS_FOR_REASON
  },
  ACTION_IDS: {
    SUBMIT_CHEERS_TO_USERS_VALUE,
    SUBMIT_CHEERS_TO_CHANNEL_VALUE,
    SUBMIT_CHEERS_FOR_REASON_VALUE
  }
} = require("../../../global/constants");
const { slackPostMessageToChannel, pushViewToModal } = require("../../api");
const {
  createCheersSubmittedTemplate,
  createInvalidRecipientsTemplate,
  createSelfCheersTemplate
} = require("./template");
const {
  getUsersForTeam,
  updateAppHomePublishedForTeam
} = require("../../../mongo/helper/user");
const { upsertAppHpmeBlocks } = require("../../../mongo/helper/appHomeBlocks");
const {
  addCheersStats,
  getCheersStatsForTeam,
  getCheersStatsForUser,
  updateCheersStatsForUser
} = require("../../../mongo/helper/cheersStats");
const { addCheers } = require("../../../mongo/helper/cheers");
const { createAppHomeLeaderBoard } = require("../../app-home/template");
const { sortLeaders } = require("../../../utils/common");
const logger = require("../../../global/logger");

const processCheers = async (payload) => {
  try {
    logger.debug("processCheers : ", JSON.stringify(payload));

    const {
      team: { id: teamId },
      view: { state, private_metadata: senderUsername },
      trigger_id
    } = payload;

    const recipients =
      state.values[SUBMIT_CHEERS_TO_USERS][SUBMIT_CHEERS_TO_USERS_VALUE]
        .selected_options;

    const channel =
      state.values[SUBMIT_CHEERS_TO_CHANNEL][SUBMIT_CHEERS_TO_CHANNEL_VALUE]
        .selected_channel;

    const reason =
      state.values[SUBMIT_CHEERS_FOR_REASON][SUBMIT_CHEERS_FOR_REASON_VALUE]
        .value;

    logger.debug("recipients : ", recipients);
    logger.debug("channel : ", channel);
    logger.debug("reason : ", reason);

    // const cheersSubmittedTemplate = createCheersSubmittedTemplate(
    //   senderUsername
    // );

    // await slackPostMessageToChannel(
    //   pollChannel,
    //   teamId,
    //   cheersSubmittedTemplate,
    //   true
    // );
  } catch (error) {
    logger.error("processCheers() -> error : ", error);
  }
};

module.exports = { processCheers };
