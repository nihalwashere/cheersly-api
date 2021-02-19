const { GraphQLInt } = require("graphql");

const LeaderBoardListArgs = {
  pageIndex: { type: GraphQLInt },
  pageSize: { type: GraphQLInt }
};

module.exports = { LeaderBoardListArgs };
