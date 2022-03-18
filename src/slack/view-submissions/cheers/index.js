const UserModel = require("../../../mongo/models/User");
const CheersModel = require("../../../mongo/models/Cheers");
const CheersStatsModel = require("../../../mongo/models/CheersStats");
const ActivityModel = require("../../../mongo/models/Activity");
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
const { ActivityTypes } = require("../../../enums/activityTypes");
const { slackPostMessageToChannel, getPermaLink } = require("../../api");
const { createCheersSubmittedTemplate } = require("./template");
const { getRandomGif } = require("../../../giphy/api");
const {
  validateRecipients,
  shareCheersNewsWithRecipientsInDM,
} = require("./helper");
const logger = require("../../../global/logger");

const processCheers = async payload => {
  try {
    const {
      team: { id: teamId },
      user: { id: senderId },
      view: { state, private_metadata: metaData },
    } = payload;

    const {
      channelId,
      channelName,
      recognitionTeamId,
      remainingPointsForUser,
    } = JSON.parse(metaData);

    const recipients =
      state.values[SUBMIT_CHEERS_TO_USERS][SUBMIT_CHEERS_TO_USERS_VALUE]
        .selected_conversations;

    const points = Number(
      state.values[SUBMIT_CHEERS_FOR_POINTS][SUBMIT_CHEERS_FOR_POINTS_VALUE]
        .selected_option.value
    );

    let companyValues = [];

    if (state.values[SUBMIT_CHEERS_FOR_COMPANY_VALUES]) {
      companyValues = state.values[SUBMIT_CHEERS_FOR_COMPANY_VALUES][
        SUBMIT_CHEERS_FOR_COMPANY_VALUES_VALUE
      ].selected_options.map(option => option.value);
    }

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
      senderId,
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

    const senderUser = await UserModel.findOne({
      "slackUserData.id": senderId,
    });

    const senderName = senderUser.slackUserData.real_name;

    // first check if stats exist for user, if it exist then update else create

    const cheersStatsSender = await CheersStatsModel.findOne({
      slackUserId: senderId,
      teamId,
    });

    logger.debug("cheersStatsSender : ", cheersStatsSender);

    if (cheersStatsSender) {
      await CheersStatsModel.findOneAndUpdate(
        { slackUserId: senderId, teamId },
        {
          cheersGiven:
            cheersStatsSender.cheersGiven + validRecipients.length * points,
        }
      );
    } else {
      await new CheersStatsModel({
        slackUserId: senderId,
        teamId,
        cheersGiven: validRecipients.length * points,
        cheersReceived: 0,
        cheersRedeemable: 0,
      }).save();
    }

    // save to cheers for insights
    await Promise.all(
      validRecipients.map(async recipient => {
        await new CheersModel({
          from: { id: senderId, name: senderName },
          to: { id: recipient.id, name: recipient.name },
          channel: { id: channelId, name: channelName },
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
          slackUserId: recipient.id,
          teamId,
        });

        if (cheersStatsRecipient) {
          const { cheersReceived, cheersRedeemable } = cheersStatsRecipient;

          await CheersStatsModel.findOneAndUpdate(
            { slackUserId: recipient.id, teamId },
            {
              cheersReceived: cheersReceived + points,
              cheersRedeemable: cheersRedeemable + points,
            }
          );
        } else {
          await new CheersStatsModel({
            slackUserId: recipient.id,
            teamId,
            cheersGiven: 0,
            cheersReceived: points,
            cheersRedeemable: points,
          }).save();
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
        "slackUserData.id": senderId,
      },
      { appHomePublished: false }
    );

    validRecipients.forEach(async recipient => {
      await UserModel.findOneAndUpdate(
        {
          "slackUserData.team_id": teamId,
          "slackUserData.id": recipient.id,
        },
        { appHomePublished: false }
      );
    });

    await new ActivityModel({
      data: {
        senderName,
        recipients: validRecipients,
        reason,
        companyValues,
        points,
      },
      type: ActivityTypes.CHEERS,
      teamId,
    }).save();

    const postMessageResponse = await slackPostMessageToChannel(
      channelId,
      teamId,
      createCheersSubmittedTemplate({
        senderId,
        recipients: validRecipients,
        reason,
        companyValues,
        giphyUrl,
        points,
      })
    );

    if (!postMessageResponse || !postMessageResponse.ok) {
      return;
    }

    const permaLinkResponse = await getPermaLink(
      teamId,
      channelId,
      postMessageResponse.ts
    );

    if (!permaLinkResponse || !permaLinkResponse.ok) {
      return;
    }

    await shareCheersNewsWithRecipientsInDM(
      teamId,
      validRecipients,
      permaLinkResponse.permalink,
      points,
      senderId,
      channelId
    );
  } catch (error) {
    logger.error("processCheers() -> error : ", error);
  }
};

module.exports = { processCheers };
