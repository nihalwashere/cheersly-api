const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLID,
  GraphQLString,
  GraphQLEnumType
} = require("graphql");
const { UserRoles } = require("../../enums/userRoles");

const SlackUserDataType = new GraphQLObjectType({
  name: "SlackUserDataType",
  fields: () => ({
    id: { type: GraphQLID },
    team_id: { type: GraphQLString },
    name: { type: GraphQLString },
    real_name: { type: GraphQLString },
    tz: { type: GraphQLString },
    profile: {
      type: new GraphQLObjectType({
        name: "SlackUserProfileType",
        fields: () => ({
          image_192: { type: GraphQLString }
        })
      })
    }
  })
});

const UserRolesEnumType = new GraphQLEnumType({
  name: "UserRolesEnumType",
  values: {
    [UserRoles.ADMIN]: {
      value: UserRoles.ADMIN
    },
    [UserRoles.MEMBER]: {
      value: UserRoles.MEMBER
    }
  }
});

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    id: { type: GraphQLID },
    slackUserData: { type: SlackUserDataType },
    slackDeleted: { type: GraphQLBoolean },
    appHomePublished: { type: GraphQLBoolean },
    role: { type: UserRolesEnumType }
  })
});

module.exports = {
  UserType
};
