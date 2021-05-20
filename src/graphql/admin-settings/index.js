const { AdminSettingsListType, AdminSwitchType } = require("./types");
const { AdminSettingsListArgs, AdminSwitchArgs } = require("./args");
const {
  AdminSettingsListResolver,
  AdminSwitchResolver
} = require("./resolvers");

const AdminSettingsList = {
  type: AdminSettingsListType,
  args: AdminSettingsListArgs,
  resolve: AdminSettingsListResolver
};

const AdminSwitch = {
  type: AdminSwitchType,
  args: AdminSwitchArgs,
  resolve: AdminSwitchResolver
};

module.exports = { AdminSettingsList, AdminSwitch };
