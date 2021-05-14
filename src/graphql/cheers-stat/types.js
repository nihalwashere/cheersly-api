const { GraphQLObjectType, GraphQLInt } = require("graphql");

const CheersStatType = new GraphQLObjectType({
  name: "CheersStatType",
  fields: () => ({
    cheersGiven: { type: GraphQLInt },
    cheersReceived: { type: GraphQLInt },
    cheersRedeemable: { type: GraphQLInt }
  })
});

module.exports = { CheersStatType };
