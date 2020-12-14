const R = require("ramda");
const logger = require("../../../global/logger");
const CheersStats = require("../../../mongo/models/CheersStats");
const User = require("../../../mongo/models/User");
const AppHomeBlocks = require("../../../mongo/models/AppHomeBlocks");
const {
  addCheersStats,
  getCheersStatsForUser
} = require("../../../mongo/helper/cheersStats");
const { createAppHomeLeaderBoard } = require("../../app-home/template");
const { getRandomGif } = require("../../../giphy/api");
const { slackPostMessageToChannel } = require("../../api");
const { createGiphyTemplate } = require("./template");

const handleCheersCommand = async (teamId, channelId, senderUsername, text) => {
  try {
    const splitArray = text.split("@");
    const trimmedText = String(text).trim();

    logger.debug("splitArray : ", splitArray);

    const n = splitArray.length - 1;
    logger.debug("n : ", n);

    const recipients = [];
    let description = "";

    for (let i = 1; i <= n; i++) {
      if (i === n) {
        logger.debug("i : ", i);
        logger.debug("here : ", splitArray[i]);
        const user = splitArray[i].split(" ")[0].trim();
        if (user) {
          recipients.push(user);
        }

        description = splitArray[i]
          .substring(splitArray[i].indexOf(" ") + 1)
          .trim();
      } else {
        // eslint-disable-next-line
        if (String(splitArray[i]).trim().length) {
          recipients.push(String(splitArray[i]).trim());
        }
      }
    }

    logger.debug("recipients : ", recipients);
    logger.debug("description : ", description);

    // first check if stats exist for user, if it exist then update else create

    // for sender

    const cheersStatsSender = await getCheersStatsForUser(senderUsername);

    if (cheersStatsSender) {
      const { cheersGiven } = cheersStatsSender;

      await CheersStats.updateOne(
        { slackUsername: senderUsername },
        { $set: { cheersGiven: cheersGiven + 1 } }
      );
    } else {
      await addCheersStats({
        slackUsername: senderUsername,
        teamId,
        cheersGiven: 1,
        cheersReceived: 0
      });
    }

    // for receivers
    await Promise.all(
      recipients.map(async (recipient) => {
        const cheersStatsRecipient = await getCheersStatsForUser(recipient);

        if (cheersStatsRecipient) {
          const { cheersReceived } = cheersStatsRecipient;

          await CheersStats.updateOne(
            { slackUsername: recipient },
            { $set: { cheersReceived: cheersReceived + 1 } }
          );
        } else {
          await addCheersStats({
            slackUsername: recipient,
            teamId,
            cheersGiven: 0,
            cheersReceived: 1
          });
        }
      })
    );

    // compute leaderboard
    const cheersStatsForTeam = await CheersStats.find({ teamId });

    const leaders = [];

    cheersStatsForTeam.map((stat) => {
      const { slackUsername, cheersReceived } = stat;
      leaders.push({ slackUsername, cheersReceived });
    });

    // sort leaders on the basis of cheers received

    const sortLeaders = R.sortWith([R.descend(R.prop("cheersReceived"))]);

    const sortedLeaders = sortLeaders(leaders);

    logger.debug("sortedLeaders : ", sortedLeaders);

    const leaderBoardBlocks = createAppHomeLeaderBoard(sortedLeaders);

    // save to app home common blocks
    await AppHomeBlocks.updateOne(
      { teamId },
      { $set: { blocks: leaderBoardBlocks } },
      { upsert: true }
    );

    // set app home published to false for this team app home for all the users in context
    await User.updateMany(
      { "slackUserData.team_id": teamId },
      { $set: { appHomePublished: false } }
    );

    // get gif

    const giphy = await getRandomGif("cheers");
    // logger.debug("giphy : ", JSON.stringify(giphy));

    if (giphy && giphy.data) {
      const {
        data: {
          images: {
            downsized: { url }
          }
        }
      } = giphy;

      const giphyTemplate = createGiphyTemplate(trimmedText, url);
      await slackPostMessageToChannel(channelId, teamId, giphyTemplate);
    }
  } catch (error) {
    logger.error("handleCheersCommand() -> error : ", error);
  }
};

const isCheersCommand = (text) => {
  if (String(text).trim().includes("@")) {
    return true;
  }

  return false;
};

module.exports = { isCheersCommand, handleCheersCommand };
