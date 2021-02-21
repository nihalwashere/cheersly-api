const {
  paginateCheersStatsForTeam
} = require("../../mongo/helper/cheersStats");
const { validateToken } = require("../../utils/common");

const LeaderBoardListResolver = async (_, args, context) => {
  try {
    const token = await validateToken(context.headers);

    if (token.status !== 200) {
      throw new Error(token.message);
    }

    const { pageIndex, pageSize } = args;

    const { data, totalCount, totalPages } = await paginateCheersStatsForTeam(
      token.slackTeamId,
      pageIndex,
      pageSize
    );
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { LeaderBoardListResolver };
