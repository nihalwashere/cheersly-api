const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLFloat
} = require("graphql");
const { UserType } = require("../common/types");

const LeaderBoardType = new GraphQLObjectType({
  name: "LeaderBoardType",
  fields: () => ({
    slackUser: { type: UserType },
    // cheersGiven: { type: GraphQLInt },
    cheersReceived: { type: GraphQLInt }
  })
});

const LeaderBoardListType = new GraphQLObjectType({
  name: "LeaderBoardListType",
  fields: () => ({
    data: { type: new GraphQLList(LeaderBoardType) },
    totalCount: { type: GraphQLInt },
    totalPages: { type: GraphQLFloat }
  })
});

module.exports = { LeaderBoardListType };
