const { GraphQLInt, GraphQLString, GraphQLBoolean } = require("graphql");

const AdminSettingsListArgs = {
  pageIndex: { type: GraphQLInt },
  pageSize: { type: GraphQLInt },
};

const AdminSwitchArgs = {
  userId: { type: GraphQLString },
  isAdmin: { type: GraphQLBoolean },
};

module.exports = { AdminSettingsListArgs, AdminSwitchArgs };
