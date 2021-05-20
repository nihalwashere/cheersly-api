const { getCheersStatsForUser } = require("../../mongo/helper/cheersStats");
const { validateToken } = require("../../utils/common");

const CheersStatResolver = async (_, args, context) => {
  try {
    const token = await validateToken(context.headers);

    if (token.status !== 200) {
      throw new Error(token.message);
    }

    const {
      slackTeamId,
      slackUserData: { name: slackUserName }
    } = token;

    const cheersStat = await getCheersStatsForUser(slackTeamId, slackUserName);

    return {
      cheersGiven:
        cheersStat && cheersStat.cheersGiven ? cheersStat.cheersGiven : 0,
      cheersReceived:
        cheersStat && cheersStat.cheersReceived ? cheersStat.cheersReceived : 0,
      cheersRedeemable:
        cheersStat && cheersStat.cheersRedeemable
          ? cheersStat.cheersRedeemable
          : 0
    };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { CheersStatResolver };
