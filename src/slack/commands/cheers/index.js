// const R = require("ramda");
// const {
//   getUsersForTeam,
//   updateAppHomePublishedForTeam
// } = require("../../../mongo/helper/user");
// const { upsertAppHpmeBlocks } = require("../../../mongo/helper/appHomeBlocks");
// const {
//   addCheersStats,
//   getCheersStatsForTeam,
//   getCheersStatsForUser,
//   updateCheersStatsForUser
// } = require("../../../mongo/helper/cheersStats");
// const { addCheers } = require("../../../mongo/helper/cheers");
// const { createAppHomeLeaderBoard } = require("../../app-home/template");
// const { slackPostMessageToChannel } = require("../../api");
// const {
//   createCheersTemplate,
//   createInvalidRecipientsTemplate,
//   createSelfCheersTemplate
// } = require("./template");

const { openModal } = require("../../api");
const { submitCheersTemplate } = require("../../templates");
const {
  VIEW_SUBMISSIONS: { SAY_CHEERS }
} = require("../../../global/constants");
const logger = require("../../../global/logger");

const handleCheersCommand = async (team_id, user_name, trigger_id) => {
  try {
    // /cheers

    const viewTemplate = submitCheersTemplate(user_name, SAY_CHEERS);

    await openModal(team_id, trigger_id, viewTemplate);

    // const splitArray = text.split("@");
    // // const trimmedText = String(text).trim();
    // logger.debug("splitArray : ", splitArray);
    // const n = splitArray.length - 1;
    // logger.debug("n : ", n);
    // const recipients = [];
    // let reason = "";
    // for (let i = 1; i <= n; i++) {
    //   if (i === n) {
    //     logger.debug("i : ", i);
    //     logger.debug("here : ", splitArray[i]);
    //     const user = splitArray[i].split(" ")[0].trim();
    //     if (user) {
    //       recipients.push(user);
    //     }
    //     reason = splitArray[i].substring(splitArray[i].indexOf(" ") + 1).trim();
    //   } else {
    //     // eslint-disable-next-line
    //     if (String(splitArray[i]).trim().length) {
    //       recipients.push(String(splitArray[i]).trim());
    //     }
    //   }
    // }
    // if (recipients.includes(reason)) {
    //   reason = "";
    // }
    // logger.debug("recipients : ", recipients);
    // logger.debug("reason : ", reason);
    // const validRecipients = [];
    // const usersForTeam = await getUsersForTeam(teamId);
    // logger.debug("usersForTeam : ", usersForTeam);
    // recipients.map((recipient) => {
    //   usersForTeam.map((user) => {
    //     if (
    //       user &&
    //       user.slackUserData &&
    //       user.slackUserData.name === recipient
    //     ) {
    //       validRecipients.push(recipient);
    //     }
    //   });
    // });
    // logger.debug("validRecipients : ", validRecipients);
    // if (validRecipients && !validRecipients.length) {
    //   return await slackPostMessageToChannel(
    //     channelId,
    //     teamId,
    //     createInvalidRecipientsTemplate()
    //   );
    // }
    // if (validRecipients && validRecipients.includes(senderUsername)) {
    //   return await slackPostMessageToChannel(
    //     channelId,
    //     teamId,
    //     createSelfCheersTemplate()
    //   );
    // }
    // // first check if stats exist for user, if it exist then update else create
    // // for sender
    // const cheersStatsSender = await getCheersStatsForUser(
    //   teamId,
    //   senderUsername
    // );
    // if (cheersStatsSender) {
    //   const { cheersGiven } = cheersStatsSender;
    //   await updateCheersStatsForUser(senderUsername, {
    //     cheersGiven: cheersGiven + 1
    //   });
    // } else {
    //   await addCheersStats({
    //     slackUsername: senderUsername,
    //     teamId,
    //     cheersGiven: 1,
    //     cheersReceived: 0
    //   });
    // }
    // // save to cheers for filters
    // await Promise.all(
    //   validRecipients.map(async (recipient) => {
    //     await addCheers({
    //       from: senderUsername,
    //       to: recipient,
    //       teamId,
    //       reason
    //     });
    //   })
    // );
    // const notifyRecipients = [];
    // // for receivers
    // await Promise.all(
    //   validRecipients.map(async (recipient) => {
    //     const cheersStatsRecipient = await getCheersStatsForUser(
    //       teamId,
    //       recipient
    //     );
    //     if (cheersStatsRecipient) {
    //       const { cheersReceived } = cheersStatsRecipient;
    //       await updateCheersStatsForUser(recipient, {
    //         cheersReceived: cheersReceived + 1
    //       });
    //       notifyRecipients.push({
    //         recipient,
    //         cheersReceived: cheersReceived + 1
    //       });
    //     } else {
    //       await addCheersStats({
    //         slackUsername: recipient,
    //         teamId,
    //         cheersGiven: 0,
    //         cheersReceived: 1
    //       });
    //       notifyRecipients.push({
    //         recipient,
    //         cheersReceived: 1
    //       });
    //     }
    //   })
    // );
    // logger.debug("notifyRecipients : ", notifyRecipients);
    // await slackPostMessageToChannel(
    //   channelId,
    //   teamId,
    //   createCheersTemplate(notifyRecipients, reason)
    // );
    // // compute leaderboard
    // const cheersStatsForTeam = await getCheersStatsForTeam(teamId);
    // logger.debug("cheersStatsForTeam : ", cheersStatsForTeam);
    // const leaders = [];
    // cheersStatsForTeam.map((stat) => {
    //   const { slackUsername, cheersReceived } = stat;
    //   leaders.push({ slackUsername, cheersReceived });
    // });
    // logger.debug("leaders : ", leaders);
    // // sort leaders on the basis of cheers received
    // const sortLeaders = R.sortWith([R.descend(R.prop("cheersReceived"))]);
    // const sortedLeaders = sortLeaders(leaders);
    // logger.debug("sortedLeaders : ", sortedLeaders);
    // const leaderBoardBlocks = createAppHomeLeaderBoard(sortedLeaders);
    // await upsertAppHpmeBlocks(teamId, { blocks: leaderBoardBlocks });
    // await updateAppHomePublishedForTeam(teamId, false);
  } catch (error) {
    logger.error("handleCheersCommand() -> error : ", error);
  }
};

const isCheersCommand = (text) => {
  if (String(text).trim().includes("@") || String(text).trim() === "") {
    return true;
  }

  return false;
};

module.exports = { isCheersCommand, handleCheersCommand };
