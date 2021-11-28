const { LeaderBoardListType } = require("./types");
const { LeaderBoardListArgs } = require("./args");
const { LeaderBoardListResolver } = require("./resolvers");

const LeaderBoardList = {
  type: LeaderBoardListType,
  args: LeaderBoardListArgs,
  resolve: LeaderBoardListResolver,
};

module.exports = { LeaderBoardList };
