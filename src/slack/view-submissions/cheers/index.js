const UserModel = require("../../../mongo/models/User");
const CheersModel = require("../../../mongo/models/Cheers");
const CheersStatsModel = require("../../../mongo/models/CheersStats");
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

    const { channelId, recognitionTeamId, remainingPointsForUser } = JSON.parse(
      metaData
    );

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

    const { errors = null, validRecipients = [] } = await validateRecipients(
      teamId,
      recipients,
      senderUserId,
      recognitionTeamId,
      channelId
    );

    logger.debug("errors : ", errors);
    logger.debug("validRecipients : ", validRecipients);

    if (errors) {
      return {
        errors,
      };
    }

    if (
      remainingPointsForUser < points ||
      remainingPointsForUser < validRecipients.length * points
    ) {
      return {
        errors: {
          [SUBMIT_CHEERS_FOR_POINTS]:
            "You don't have sufficient points to give.",
        },
      };
    }

    // first check if stats exist for user, if it exist then update else create

    const cheersStatsSender = await CheersStatsModel.findOne({
      slackUserId: senderUserId,
      teamId,
    });

    logger.debug("cheersStatsSender : ", cheersStatsSender);

    if (cheersStatsSender) {
      await CheersStatsModel.findOneAndUpdate(
        { slackUserId: senderUserId, teamId },
        {
          cheersGiven:
            cheersStatsSender.cheersGiven + validRecipients.length * points,
        }
      );
    } else {
      await new CheersStatsModel({
        slackUserId: senderUserId,
        teamId,
        cheersGiven: validRecipients.length * points,
        cheersReceived: 0,
        cheersRedeemable: 0,
      }).save();
    }

    // save to cheers for activity
    await Promise.all(
      validRecipients.map(async recipient => {
        await new CheersModel({
          from: senderUserId,
          to: recipient,
          companyValues,
          reason,
          points,
          teamId,
          recognitionTeamId,
        }).save();
      })
    );

    // for receivers
    await Promise.all(
      validRecipients.map(async recipient => {
        const cheersStatsRecipient = await CheersStatsModel.findOne({
          slackUserId: recipient,
          teamId,
        });

        if (cheersStatsRecipient) {
          const { cheersReceived, cheersRedeemable } = cheersStatsRecipient;

          await CheersStatsModel.findOneAndUpdate(
            { slackUserId: recipient, teamId },
            {
              cheersReceived: cheersReceived + points,
              cheersRedeemable: cheersRedeemable + points,
            }
          );
        } else {
          await new CheersStatsModel({
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

    await UserModel.findOneAndUpdate(
      {
        "slackUserData.team_id": teamId,
        "slackUserData.id": senderUserId,
      },
      { appHomePublished: false }
    );

    await slackPostMessageToChannel(
      channelId,
      teamId,
      createCheersSubmittedTemplate({
        senderUserId,
        recipients: validRecipients,
        reason,
        companyValues,
        giphyUrl,
        points,
      })
    );
  } catch (error) {
    logger.error("processCheers() -> error : ", error);
  }
};

module.exports = { processCheers };
