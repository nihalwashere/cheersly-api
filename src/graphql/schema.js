const graphql = require("graphql");

const { GraphQLObjectType, GraphQLSchema } = graphql;

const { LeaderBoardList } = require("./leaderboard");
const { CheersStat } = require("./cheers-stat");
const {
  CompanyValuesList,
  CreateCompanyValues,
  UpdateCompanyValues,
  DeleteCompanyValues
} = require("./company-values");

/*
 * Root Query
 */
const query = new GraphQLObjectType({
  name: "Query",
  fields: () => ({ LeaderBoardList, CheersStat, CompanyValuesList })
});

/*
 * Root Mutation
 */
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    CreateCompanyValues,
    UpdateCompanyValues,
    DeleteCompanyValues
  })
});

module.exports = new GraphQLSchema({
  query,
  mutation
});
