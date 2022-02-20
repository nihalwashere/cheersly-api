const CheersModel = require("../../../mongo/models/Cheers");
const CheersStatsModel = require("../../../mongo/models/CheersStats");
// const RecognitionTeamsModel = require("../../../mongo/models/RecognitionTeams");
const {
  BLOCK_IDS: {
    SUBMIT_CHEERS_TO_USERS,
    SUBMIT_CHEERS_FOR_POINTS,
    SUBMIT_CHEERS_FOR_COMPANY_VALUES,
    SUBMIT_CHEERS_FOR_REASON,
    SHOULD_SHARE_GIPHY,
  },
  ACTION_IDS: {
    SUBMIT_CHEERS_TO_USERS_VALUE,
    SUBMIT_CHEERS_FOR_POINTS_VALUE,
    SUBMIT_CHEERS_FOR_COMPANY_VALUES_VALUE,
    SUBMIT_CHEERS_FOR_REASON_VALUE,
    SHOULD_SHARE_GIPHY_VALUE,
  },
} = require("../../../global/constants");
const { slackPostMessageToChannel } = require("../../api");
const { createCheersSubmittedTemplate } = require("./template");
const { updateAppHomePublishedForTeam } = require("../../../mongo/helper/user");
const { upsertAppHpmeBlocks } = require("../../../mongo/helper/appHomeBlocks");
const { sortLeaders, getAppUrl } = require("../../../utils/common");
const { getRandomGif } = require("../../../giphy/api");
const { validateRecipients } = require("./helper");
const logger = require("../../../global/logger");

const processCheers = async payload => {
  try {
    const {
      team: { id: teamId },
      user: { id: senderUserId },
      view: { state, private_metadata: metaData },
    } = payload;

    const { channelId, recognitionTeamId } = JSON.parse(metaData);

    const recipients =
      state.values[SUBMIT_CHEERS_TO_USERS][SUBMIT_CHEERS_TO_USERS_VALUE]
        .selected_conversations;

    const points = Number(
      state.values[SUBMIT_CHEERS_FOR_POINTS][SUBMIT_CHEERS_FOR_POINTS_VALUE]
        .selected_option.value
    );

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
      senderUserId
    );

    logger.debug("validRecipients : ", validRecipients);

    const cheersStatsSender = await CheersStatsModel.findOne({
      recognitionTeamId,
      slackUserId: senderUserId,
      teamId,
    });

    logger.debug("cheersStatsSender : ", cheersStatsSender);

    if (cheersStatsSender) {
      await CheersStatsModel.findOneAndUpdate(
        { recognitionTeamId, slackUserId: senderUserId, teamId },
        {
          cheersGiven: cheersStatsSender.cheersGiven + points,
        }
      );
    } else {
      await new CheersStatsModel({
        recognitionTeamId,
        slackUserId: senderUserId,
        teamId,
        cheersGiven: points,
        cheersReceived: 0,
        cheersRedeemable: 0,
      });
    }

    // save to cheers for activity
    await Promise.all(
      validRecipients.map(async recipient => {
        await new CheersModel({
          from: senderUserId,
          to: recipient,
          companyValues,
          reason,
          teamId,
          recognitionTeamId,
        }).save();
      })
    );

    // for receivers
    await Promise.all(
      validRecipients.map(async recipient => {
        const cheersStatsRecipient = await CheersStatsModel.findOne({
          recognitionTeamId,
          slackUserId: recipient,
          teamId,
        });

        if (cheersStatsRecipient) {
          const { cheersReceived, cheersRedeemable } = cheersStatsRecipient;

          await CheersStatsModel.findOneAndUpdate(
            { recognitionTeamId, slackUserId: recipient, teamId },
            {
              cheersReceived: cheersReceived + points,
              cheersRedeemable: cheersRedeemable + points,
            }
          );
        } else {
          await new CheersStatsModel({
            recognitionTeamId,
            slackUserId: recipient,
            teamId,
            cheersGiven: 0,
            cheersReceived: points,
            cheersRedeemable: points,
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

    // compute leaderboard
    // const cheersStatsForTeam = await getCheersStatsForTeam(teamId);

    // const leaders = [];

    // cheersStatsForTeam.map(stat => {
    //   const { slackUsername, cheersReceived } = stat;
    //   leaders.push({ slackUsername, cheersReceived });
    // });

    // const sortedLeaders = sortLeaders(leaders);

    // const leaderBoardBlocks = createAppHomeLeaderBoard({
    //   leaders: sortedLeaders,
    //   leaderBoardUrl: `${getAppUrl()}/leaderboard`,
    // });

    // await upsertAppHpmeBlocks(teamId, { blocks: leaderBoardBlocks });
    // await updateAppHomePublishedForTeam(teamId, false);

    await slackPostMessageToChannel(
      channelId,
      teamId,
      createCheersSubmittedTemplate({
        senderUserId,
        recipients: validRecipients,
        reason,
        companyValues,
        giphyUrl,
      })
    );
  } catch (error) {
    logger.error("processCheers() -> error : ", error);
  }
};

module.exports = { processCheers };
