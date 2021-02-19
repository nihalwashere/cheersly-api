const graphql = require("graphql");

const { GraphQLObjectType, GraphQLSchema } = graphql;
const {
  CreateHypeDocMutation,
  HypeDocsList,
  UpdateHypeDocMutation,
  DeleteHypeDocMutation,
  HypeDocDetails
} = require("./hype-docs");

const { LeaderBoardList } = require("./leaderboard");

/*
 * Root Query
 */
const query = new GraphQLObjectType({
  name: "Query",
  fields: () => ({ HypeDocsList, HypeDocDetails, LeaderBoardList })
});

/*
 * Root Mutation
 */
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    CreateHypeDocMutation,
    UpdateHypeDocMutation,
    DeleteHypeDocMutation
  })
});

module.exports = new GraphQLSchema({
  query,
  mutation
});
