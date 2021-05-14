const { validateToken } = require("../../utils/common");
const {
  paginateUsersForTeam,
  updateRoleForUser
} = require("../../mongo/helper/user");
const { UserRoles } = require("../../enums/userRoles");

const AdminSettingsListResolver = async (_, args, context) => {
  try {
    const { slackTeamId } = await validateToken(context.headers);

    const { pageIndex, pageSize } = args;

    const { data, totalCount, totalPages } = await paginateUsersForTeam(
      slackTeamId,
      pageIndex,
      pageSize
    );

    return {
      data,
      totalCount,
      totalPages
    };
  } catch (error) {
    throw new Error(error);
  }
};

const AdminSwitchResolver = async (_, args, context) => {
  try {
    await validateToken(context.headers);

    const { userId, isAdmin } = args;

    const role = isAdmin ? UserRoles.ADMIN : UserRoles.MEMBER;

    await updateRoleForUser(userId, role);

    return {
      success: true
    };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { AdminSettingsListResolver, AdminSwitchResolver };
