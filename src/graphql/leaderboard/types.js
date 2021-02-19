const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLID
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");

const LeaderBoardType = new GraphQLObjectType({
  name: "LeaderBoardType",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    category: { type: GraphQLString },
    when: { type: GraphQLDateTime },
    content: { type: GraphQLString }
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
