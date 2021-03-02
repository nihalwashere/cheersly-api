const { GraphQLInt, GraphQLString } = require("graphql");

const LeaderBoardListArgs = {
  pageIndex: { type: GraphQLInt },
  pageSize: { type: GraphQLInt },
  type: { type: GraphQLString },
  duration: { type: GraphQLString }
};

module.exports = { LeaderBoardListArgs };
