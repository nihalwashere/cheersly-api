const graphql = require("graphql");

const { GraphQLObjectType, GraphQLSchema } = graphql;

const { LeaderBoardList } = require("./leaderboard");

/*
 * Root Query
 */
const query = new GraphQLObjectType({
  name: "Query",
  fields: () => ({ LeaderBoardList })
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
