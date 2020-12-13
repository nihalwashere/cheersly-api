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

const handleCheersCommand = async (teamId, channelId, senderUserId, text) => {
  try {
    const splitArray = text.split("@");

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
        recipients.push(user);

        description = splitArray[i]
          .substring(splitArray[i].indexOf(" ") + 1)
          .trim();
      } else {
        recipients.push(String(splitArray[i]).trim());
      }
    }

    logger.debug("recipients : ", recipients);
    logger.debug("description : ", description);

    // first check if stats exist for user, if it exist then update else create

    // for sender

    const cheersStatsSender = await getCheersStatsForUser(senderUserId);

    if (cheersStatsSender) {
      const { cheersGiven } = cheersStatsSender;

      await CheersStats.updateOne(
        { slackUserId: senderUserId },
        { $set: { cheersGiven: cheersGiven + 1 } }
      );
    } else {
      await addCheersStats({
        slackUserId: senderUserId,
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
            { slackUserId: recipient },
            { $set: { cheersReceived: cheersReceived + 1 } }
          );
        } else {
          await addCheersStats({
            slackUserId: recipient,
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
      const { slackUserId, cheersReceived } = stat;
      leaders.push({ slackUserId, cheersReceived });
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
    await User.updateMany({ teamId }, { $set: { appHomePublished: false } });
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
