const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
} = require("graphql");
const { UserType } = require("../common/types");

const AdminSettingsListType = new GraphQLObjectType({
  name: "AdminSettingsListType",
  fields: () => ({
    data: { type: new GraphQLList(UserType) },
    totalCount: { type: GraphQLInt },
    totalPages: { type: GraphQLFloat },
  }),
});

const AdminSwitchType = new GraphQLObjectType({
  name: "AdminSwitchType",
  fields: () => ({
    success: { type: GraphQLBoolean },
  }),
});

module.exports = { AdminSettingsListType, AdminSwitchType };
