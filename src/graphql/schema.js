const graphql = require("graphql");

const { GraphQLObjectType, GraphQLSchema } = graphql;

const { LeaderBoardList } = require("./leaderboard");
const { CheersStat } = require("./cheers-stat");

/*
 * Root Query
 */
const query = new GraphQLObjectType({
  name: "Query",
  fields: () => ({ LeaderBoardList, CheersStat })
});

/*
 * Root Mutation
 */
// const mutation = new GraphQLObjectType({
//   name: "Mutation",
//   fields: () => ({})
// });

module.exports = new GraphQLSchema({
  query
  // mutation
});
