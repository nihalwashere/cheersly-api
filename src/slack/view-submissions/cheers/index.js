const {
  BLOCK_IDS: {
    SUBMIT_CHEERS_TO_USERS,
    SUBMIT_CHEERS_TO_CHANNEL,
    SUBMIT_CHEERS_FOR_REASON,
    SHOULD_SHARE_GIPHY
  },
  ACTION_IDS: {
    SUBMIT_CHEERS_TO_USERS_VALUE,
    SUBMIT_CHEERS_TO_CHANNEL_VALUE,
    SUBMIT_CHEERS_FOR_REASON_VALUE,
    SHOULD_SHARE_GIPHY_VALUE
  }
} = require("../../../global/constants");
const {
  slackPostMessageToChannel,
  postEphemeralMessage
} = require("../../api");
const {
  createCheersSubmittedTemplate,
  createSelectPeersTemplate
} = require("./template");
const { updateAppHomePublishedForTeam } = require("../../../mongo/helper/user");
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
const { getRandomGif } = require("../../../giphy/api");
const { validateRecipients } = require("./helper");
const logger = require("../../../global/logger");

const processCheers = async (payload) => {
  try {
    logger.debug("processCheers : ", JSON.stringify(payload));

    const {
      team: { id: teamId },
      user: { id: senderUserId },
      view: { state, private_metadata: senderUsername }
    } = payload;

    const recipients =
      state.values[SUBMIT_CHEERS_TO_USERS][SUBMIT_CHEERS_TO_USERS_VALUE]
        .selected_users;

    const channel =
      state.values[SUBMIT_CHEERS_TO_CHANNEL][SUBMIT_CHEERS_TO_CHANNEL_VALUE]
        .selected_channel;

    const reason =
      state.values[SUBMIT_CHEERS_FOR_REASON][SUBMIT_CHEERS_FOR_REASON_VALUE]
        .value;

    const shouldShareGiphy = state.values[SHOULD_SHARE_GIPHY][
      SHOULD_SHARE_GIPHY_VALUE
    ].selected_options.length
      ? true // eslint-disable-line
      : false;

    logger.debug("recipients : ", recipients);
    logger.debug("channel : ", channel);
    logger.debug("reason : ", reason);
    logger.debug("shouldShareGiphy : ", shouldShareGiphy);

    // first check if stats exist for user, if it exist then update else create

    // for sender
    const cheersStatsSender = await getCheersStatsForUser(
      teamId,
      senderUsername
    );
    if (cheersStatsSender) {
      const { cheersGiven } = cheersStatsSender;
      await updateCheersStatsForUser(senderUsername, {
        cheersGiven: cheersGiven + 1
      });
    } else {
      await addCheersStats({
        slackUsername: senderUsername,
        teamId,
        cheersGiven: 1,
        cheersReceived: 0
      });
    }

    const validRecipients = await validateRecipients(
      teamId,
      recipients,
      senderUsername
    );

    if (validRecipients && validRecipients.length) {
      // save to cheers for filters
      await Promise.all(
        validRecipients.map(async (recipient) => {
          await addCheers({
            from: senderUsername,
            to: recipient,
            teamId,
            reason
          });
        })
      );

      const notifyRecipients = [];
      // for receivers
      await Promise.all(
        validRecipients.map(async (recipient) => {
          const cheersStatsRecipient = await getCheersStatsForUser(
            teamId,
            recipient
          );

          if (cheersStatsRecipient) {
            const { cheersReceived } = cheersStatsRecipient;

            await updateCheersStatsForUser(recipient, {
              cheersReceived: cheersReceived + 1
            });

            notifyRecipients.push({
              recipient,
              cheersReceived: cheersReceived + 1
            });
          } else {
            await addCheersStats({
              slackUsername: recipient,
              teamId,
              cheersGiven: 0,
              cheersReceived: 1
            });
            notifyRecipients.push({
              recipient,
              cheersReceived: 1
            });
          }
        })
      );

      logger.debug("notifyRecipients : ", notifyRecipients);

      let giphyUrl = "";

      if (shouldShareGiphy) {
        const giphy = await getRandomGif("cheers");
        // logger.debug("giphy : ", JSON.stringify(giphy));

        if (
          giphy &&
          giphy.data &&
          giphy.data.images &&
          giphy.data.images.downsized &&
          giphy.data.images.downsized.url
        ) {
          giphyUrl = giphy.data.images.downsized.url;
        }
      }

      await slackPostMessageToChannel(
        channel,
        teamId,
        createCheersSubmittedTemplate(
          senderUsername,
          notifyRecipients,
          reason,
          giphyUrl
        )
      );

      // compute leaderboard
      const cheersStatsForTeam = await getCheersStatsForTeam(teamId);

      logger.debug("cheersStatsForTeam : ", cheersStatsForTeam);

      const leaders = [];

      cheersStatsForTeam.map((stat) => {
        const { slackUsername, cheersReceived } = stat;
        leaders.push({ slackUsername, cheersReceived });
      });

      logger.debug("leaders : ", leaders);

      const sortedLeaders = sortLeaders(leaders);
      logger.debug("sortedLeaders : ", sortedLeaders);

      const leaderBoardBlocks = createAppHomeLeaderBoard(sortedLeaders);
      await upsertAppHpmeBlocks(teamId, { blocks: leaderBoardBlocks });
      await updateAppHomePublishedForTeam(teamId, false);
    } else {
      await postEphemeralMessage(
        channel,
        senderUserId,
        teamId,
        createSelectPeersTemplate()
      );
    }
  } catch (error) {
    logger.error("processCheers() -> error : ", error);
  }
};

module.exports = { processCheers };
