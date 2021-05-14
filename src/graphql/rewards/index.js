const {
  RewardListType,
  CreateRewardType,
  UpdateRewardType,
  DeleteRewardType,
  RedemptionRequestListType,
  CreateRedemptionRequestType,
  SettleRedemptionRequestType,
  DeclineRedemptionRequestType,
  RewardsHistoryListType
} = require("./types");
const {
  RewardListArgs,
  CreateRewardArgs,
  UpdateRewardArgs,
  DeleteRewardArgs,
  RedemptionRequestListArgs,
  CreateRedemptionRequestArgs,
  SettleRedemptionRequestArgs,
  DeclineRedemptionRequestArgs,
  RewardsHistoryListArgs
} = require("./args");
const {
  RewardListResolver,
  CreateRewardResolver,
  UpdateRewardResolver,
  DeleteRewardResolver,
  RedemptionRequestListResolver,
  CreateRedemptionRequestResolver,
  SettleRedemptionRequestResolver,
  DeclineRedemptionRequestResolver,
  RewardsHistoryListResolver
} = require("./resolvers");

const RewardList = {
  type: RewardListType,
  args: RewardListArgs,
  resolve: RewardListResolver
};

const CreateReward = {
  type: CreateRewardType,
  args: CreateRewardArgs,
  resolve: CreateRewardResolver
};

const UpdateReward = {
  type: UpdateRewardType,
  args: UpdateRewardArgs,
  resolve: UpdateRewardResolver
};

const DeleteReward = {
  type: DeleteRewardType,
  args: DeleteRewardArgs,
  resolve: DeleteRewardResolver
};

const RedemptionRequestList = {
  type: RedemptionRequestListType,
  args: RedemptionRequestListArgs,
  resolve: RedemptionRequestListResolver
};

const CreateRedemptionRequest = {
  type: CreateRedemptionRequestType,
  args: CreateRedemptionRequestArgs,
  resolve: CreateRedemptionRequestResolver
};

const SettleRedemptionRequest = {
  type: SettleRedemptionRequestType,
  args: SettleRedemptionRequestArgs,
  resolve: SettleRedemptionRequestResolver
};

const DeclineRedemptionRequest = {
  type: DeclineRedemptionRequestType,
  args: DeclineRedemptionRequestArgs,
  resolve: DeclineRedemptionRequestResolver
};

const RewardsHistoryList = {
  type: RewardsHistoryListType,
  args: RewardsHistoryListArgs,
  resolve: RewardsHistoryListResolver
};

module.exports = {
  RewardList,
  CreateReward,
  UpdateReward,
  DeleteReward,
  RedemptionRequestList,
  CreateRedemptionRequest,
  SettleRedemptionRequest,
  DeclineRedemptionRequest,
  RewardsHistoryList
};
