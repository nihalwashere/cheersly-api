const { GraphQLString, GraphQLInt } = require("graphql");

const RewardListArgs = {};

const CreateRewardArgs = {
  title: { type: GraphQLString },
  description: { type: GraphQLString },
  price: { type: GraphQLString },
};

const UpdateRewardArgs = {
  id: { type: GraphQLString },
  title: { type: GraphQLString },
  description: { type: GraphQLString },
  price: { type: GraphQLString },
};

const DeleteRewardArgs = {
  id: { type: GraphQLString },
};

const RedemptionRequestListArgs = {
  pageIndex: { type: GraphQLInt },
  pageSize: { type: GraphQLInt },
};

const CreateRedemptionRequestArgs = {
  userId: { type: GraphQLString },
  rewardId: { type: GraphQLString },
};

const SettleRedemptionRequestArgs = {
  id: { type: GraphQLString },
};

const DeclineRedemptionRequestArgs = {
  id: { type: GraphQLString },
};

const RewardsHistoryListArgs = {
  pageIndex: { type: GraphQLInt },
  pageSize: { type: GraphQLInt },
};

module.exports = {
  RewardListArgs,
  CreateRewardArgs,
  UpdateRewardArgs,
  DeleteRewardArgs,
  RedemptionRequestListArgs,
  CreateRedemptionRequestArgs,
  SettleRedemptionRequestArgs,
  DeclineRedemptionRequestArgs,
  RewardsHistoryListArgs,
};
