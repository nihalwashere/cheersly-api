const { GraphQLObjectType, GraphQLInt } = require("graphql");

const CheersStatType = new GraphQLObjectType({
  name: "CheersStatType",
  fields: () => ({
    cheersGiven: { type: GraphQLInt },
    cheersReceived: { type: GraphQLInt }
  })
});

module.exports = { CheersStatType };
