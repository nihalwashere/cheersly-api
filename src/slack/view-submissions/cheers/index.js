const {
  BLOCK_IDS: {
    SUBMIT_CHEERS_TO_USERS,
    SUBMIT_CHEERS_TO_CHANNEL,
    SUBMIT_CHEERS_FOR_COMPANY_VALUES,
    SUBMIT_CHEERS_FOR_REASON,
    SHOULD_SHARE_GIPHY,
  },
  ACTION_IDS: {
    SUBMIT_CHEERS_TO_USERS_VALUE,
    SUBMIT_CHEERS_TO_CHANNEL_VALUE,
    SUBMIT_CHEERS_FOR_COMPANY_VALUES_VALUE,
    SUBMIT_CHEERS_FOR_REASON_VALUE,
    SHOULD_SHARE_GIPHY_VALUE,
  },
} = require("../../../global/constants");
const {
  slackPostMessageToChannel,
  postEphemeralMessage,
} = require("../../api");
const {
  createCheersSubmittedTemplate,
  createSelectPeersTemplate,
} = require("./template");
const { updateAppHomePublishedForTeam } = require("../../../mongo/helper/user");
const { upsertAppHpmeBlocks } = require("../../../mongo/helper/appHomeBlocks");
const {
  addCheersStats,
  getCheersStatsForTeam,
  getCheersStatsForUser,
  updateCheersStatsForUser,
} = require("../../../mongo/helper/cheersStats");
const { addCheers } = require("../../../mongo/helper/cheers");
const { createAppHomeLeaderBoard } = require("../../app-home/template");
const { sortLeaders, getAppUrl } = require("../../../utils/common");
const { getRandomGif } = require("../../../giphy/api");
const { validateRecipients } = require("./helper");
const logger = require("../../../global/logger");

const processCheers = async payload => {
  try {
    const {
      team: { id: teamId },
      user: { id: senderUserId },
      view: { state, private_metadata: senderUsername },
    } = payload;

    const recipients =
      state.values[SUBMIT_CHEERS_TO_USERS][SUBMIT_CHEERS_TO_USERS_VALUE]
        .selected_conversations;

    const channel =
      state.values[SUBMIT_CHEERS_TO_CHANNEL][SUBMIT_CHEERS_TO_CHANNEL_VALUE]
        .selected_conversation;

    const companyValues = state.values[SUBMIT_CHEERS_FOR_COMPANY_VALUES][
      SUBMIT_CHEERS_FOR_COMPANY_VALUES_VALUE
    ].selected_options.map(option => option.value);

    const reason =
      state.values[SUBMIT_CHEERS_FOR_REASON][SUBMIT_CHEERS_FOR_REASON_VALUE]
        .value;

    const shouldShareGiphy = state.values[SHOULD_SHARE_GIPHY][
      SHOULD_SHARE_GIPHY_VALUE
    ].selected_options.length
      ? true // eslint-disable-line
      : false;

    // first check if stats exist for user, if it exist then update else create

    const validRecipients = await validateRecipients(
      teamId,
      recipients,
      senderUsername
    );

    if (validRecipients && validRecipients.length) {
      // for sender
      const cheersStatsSender = await getCheersStatsForUser(
        teamId,
        senderUsername
      );

      if (cheersStatsSender) {
        const { cheersGiven } = cheersStatsSender;
        await updateCheersStatsForUser(senderUsername, {
          cheersGiven: cheersGiven + validRecipients.length,
        });
      } else {
        await addCheersStats({
          slackUsername: senderUsername,
          teamId,
          cheersGiven: validRecipients.length,
          cheersReceived: 0,
          cheersRedeemable: 0,
        });
      }

      // save to cheers for filters
      await Promise.all(
        validRecipients.map(async recipient => {
          await addCheers({
            from: senderUsername,
            to: recipient,
            teamId,
            reason,
          });
        })
      );

      const notifyRecipients = [];
      // for receivers
      await Promise.all(
        validRecipients.map(async recipient => {
          const cheersStatsRecipient = await getCheersStatsForUser(
            teamId,
            recipient
          );

          if (cheersStatsRecipient) {
            const { cheersReceived, cheersRedeemable } = cheersStatsRecipient;

            await updateCheersStatsForUser(recipient, {
              cheersReceived: cheersReceived + 1,
              cheersRedeemable: cheersRedeemable + 1,
            });

            notifyRecipients.push({
              recipient,
              cheersReceived: cheersReceived + 1,
            });
          } else {
            await addCheersStats({
              slackUsername: recipient,
              teamId,
              cheersGiven: 0,
              cheersReceived: 1,
              cheersRedeemable: 1,
            });

            notifyRecipients.push({
              recipient,
              cheersReceived: 1,
            });
          }
        })
      );

      let giphyUrl = "";

      if (shouldShareGiphy) {
        const giphy = await getRandomGif("cheers");

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
          giphyUrl,
          companyValues
        )
      );

      // compute leaderboard
      const cheersStatsForTeam = await getCheersStatsForTeam(teamId);

      const leaders = [];

      cheersStatsForTeam.map(stat => {
        const { slackUsername, cheersReceived } = stat;
        leaders.push({ slackUsername, cheersReceived });
      });

      const sortedLeaders = sortLeaders(leaders);

      const leaderBoardBlocks = createAppHomeLeaderBoard({
        leaders: sortedLeaders,
        leaderBoardUrl: `${getAppUrl()}/leaderboard`,
      });

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
