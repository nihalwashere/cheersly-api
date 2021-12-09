// const mongoose = require("mongoose");
// const pMap = require("p-map");
// const MatchMomentsModel = require("../mongo/models/MatchMoments");
// const { MONGO_URL, MONGO_OPTIONS } = require("../global/config");
// const {
//   getClosedPolls,
//   markPollAsClosed,
// } = require("../mongo/helper/pollQuestions");
// const { getUserDataBySlackUserName } = require("../mongo/helper/user");
// const { getAllPollAnswers } = require("../mongo/helper/pollAnswers");
// const { slackPostMessageToChannel, updateChat } = require("../slack/api");
// const logger = require("../global/logger");

// const service = async () => {
//   try {
//     logger.info("STARTING MATCH MOMENTS CRON SERVICE");

//     const matchMoments = await MatchMomentsModel.find({});

//     // const handler = async poll => {};

//     // if (closedPolls && closedPolls.length) {
//     //   await pMap(closedPolls, handler, { concurrency: 1 });
//     // }
//   } catch (error) {
//     logger.error("MATCH MOMENTS SERVICE FAILED -> error : ", error);
//   }
// };

// // Connect To Database
// mongoose.Promise = global.Promise;
// mongoose.connect(MONGO_URL, {
//   keepAlive: true,
//   ...MONGO_OPTIONS,
// });

// // On Connection
// mongoose.connection.on("connected", async () => {
//   try {
//     logger.info("Connected to database from match moments cron service");

//     // execute service
//     await service();

//     mongoose.disconnect();
//   } catch (error) {
//     logger.error(error);
//     mongoose.disconnect();
//   }
// });

// // On Error
// mongoose.connection.on("error", error => {
//   logger.error(
//     "Database error from match moments cron service -> error : ",
//     error
//   );
// });
