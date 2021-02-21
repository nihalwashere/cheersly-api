const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLID,
  GraphQLString
} = require("graphql");

const SlackUserDataType = new GraphQLObjectType({
  name: "SlackUserDataType",
  fields: () => ({
    id: { type: GraphQLID },
    team_id: { type: GraphQLString },
    name: { type: GraphQLString },
    real_name: { type: GraphQLString },
    tz: { type: GraphQLString }
  })
});

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    id: { type: GraphQLID },
    slackDeleted: { type: GraphQLBoolean },
    appHomePublished: { type: GraphQLBoolean },
    slackUserData: { type: SlackUserDataType }
  })
});

module.exports = {
  UserType
};
