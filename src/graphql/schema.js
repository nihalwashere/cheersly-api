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
const {
  RewardList,
  CreateReward,
  UpdateReward,
  DeleteReward,
  RedemptionRequestList,
  CreateRedemptionRequest,
  SettleRedemptionRequest,
  DeclineRedemptionRequest,
  RewardsHistoryList
} = require("./rewards");
const { AdminSettingsList, AdminSwitch } = require("./admin-settings");

/*
 * Root Query
 */
const query = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    LeaderBoardList,
    CheersStat,
    CompanyValuesList,
    RewardList,
    AdminSettingsList,
    RedemptionRequestList,
    RewardsHistoryList
  })
});

/*
 * Root Mutation
 */
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    AdminSwitch,

    // Company Values
    CreateCompanyValues,
    UpdateCompanyValues,
    DeleteCompanyValues,

    // Rewards
    CreateReward,
    UpdateReward,
    DeleteReward,
    CreateRedemptionRequest,
    SettleRedemptionRequest,
    DeclineRedemptionRequest
  })
});

module.exports = new GraphQLSchema({
  query,
  mutation
});
