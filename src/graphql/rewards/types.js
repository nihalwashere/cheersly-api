const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");
const { UserType } = require("../common/types");

const RewardType = new GraphQLObjectType({
  name: "RewardType",
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    price: { type: GraphQLString }
  })
});

const RewardListType = new GraphQLObjectType({
  name: "RewardListType",
  fields: () => ({
    data: { type: new GraphQLList(RewardType) }
  })
});

const CreateRewardType = new GraphQLObjectType({
  name: "CreateRewardType",
  fields: () => ({
    success: { type: GraphQLBoolean }
  })
});

const UpdateRewardType = new GraphQLObjectType({
  name: "UpdateRewardType",
  fields: () => ({
    success: { type: GraphQLBoolean }
  })
});

const DeleteRewardType = new GraphQLObjectType({
  name: "DeleteRewardType",
  fields: () => ({
    success: { type: GraphQLBoolean }
  })
});

const RedemptionRequestType = new GraphQLObjectType({
  name: "RedemptionRequestType",
  fields: () => ({
    id: { type: GraphQLString },
    user: { type: UserType },
    reward: { type: RewardType },
    status: { type: GraphQLString },
    teamId: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime }
  })
});

const RedemptionRequestListType = new GraphQLObjectType({
  name: "RedemptionRequestListType",
  fields: () => ({
    data: { type: new GraphQLList(RedemptionRequestType) },
    totalCount: { type: GraphQLInt },
    totalPages: { type: GraphQLFloat }
  })
});

const CreateRedemptionRequestType = new GraphQLObjectType({
  name: "CreateRedemptionRequestType",
  fields: () => ({
    success: { type: GraphQLBoolean },
    message: { type: GraphQLString }
  })
});

const SettleRedemptionRequestType = new GraphQLObjectType({
  name: "SettleRedemptionRequestType",
  fields: () => ({
    success: { type: GraphQLBoolean },
    message: { type: GraphQLString }
  })
});

const DeclineRedemptionRequestType = new GraphQLObjectType({
  name: "DeclineRedemptionRequestType",
  fields: () => ({
    success: { type: GraphQLBoolean },
    message: { type: GraphQLString }
  })
});

const RewardsHistoryListType = new GraphQLObjectType({
  name: "RewardsHistoryListType",
  fields: () => ({
    data: { type: new GraphQLList(RedemptionRequestType) },
    totalCount: { type: GraphQLInt },
    totalPages: { type: GraphQLFloat }
  })
});

module.exports = {
  RewardListType,
  CreateRewardType,
  UpdateRewardType,
  DeleteRewardType,
  RedemptionRequestListType,
  CreateRedemptionRequestType,
  SettleRedemptionRequestType,
  DeclineRedemptionRequestType,
  RewardsHistoryListType
};
