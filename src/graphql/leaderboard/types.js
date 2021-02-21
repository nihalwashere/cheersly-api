const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLID
} = require("graphql");
const { UserType } = require("../common/types");

const LeaderBoardType = new GraphQLObjectType({
  name: "LeaderBoardType",
  fields: () => ({
    id: { type: GraphQLID },
    slackUser: { type: UserType },
    cheersGiven: { type: GraphQLInt },
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
