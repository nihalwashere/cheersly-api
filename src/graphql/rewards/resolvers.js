const {
  getRewardById,
  getRewardsByTeamId,
  addRewards,
  updateRewardsById,
  deleteRewardsById
} = require("../../mongo/helper/rewards");
const { slackPostMessageToChannel } = require("../../slack/api");
const { getUserDataById } = require("../../mongo/helper/user");
const {
  getCheersStatsForUser,
  updateCheersStatsForUser
} = require("../../mongo/helper/cheersStats");
const {
  addRedemptionRequest,
  getRedemptionRequestById,
  updateRedemptionRequestById,
  declineRedemptionRequestByRewardId,
  paginateRedemptionRequests
} = require("../../mongo/helper/redemptionRequests");
const {
  RedemptionRequestStatus
} = require("../../enums/redemptionRequestStatus");
const {
  createRedemptionRequestSettledTemplate,
  createRedemptionRequestDeclinedTemplate
} = require("./template");
const { validateToken } = require("../../utils/common");

const RewardListResolver = async (_, args, context) => {
  try {
    const token = await validateToken(context.headers);

    if (token.status !== 200) {
      throw new Error(token.message);
    }

    const { slackTeamId } = token;

    const data = await getRewardsByTeamId(slackTeamId);

    return {
      data
    };
  } catch (error) {
    throw new Error(error);
  }
};

const CreateRewardResolver = async (_, args, context) => {
  try {
    const token = await validateToken(context.headers);

    if (token.status !== 200) {
      throw new Error(token.message);
    }

    const { slackTeamId: teamId } = token;

    const { title, description, price } = args;

    if (!title) {
      throw new Error("Title is required.");
    }

    if (!description) {
      throw new Error("Description is required.");
    }

    if (!price) {
      throw new Error("Price is required.");
    }

    await addRewards({ title, description, price, teamId });

    return {
      success: true,
      message: "Reward created successfully."
    };
  } catch (error) {
    throw new Error(error);
  }
};

const UpdateRewardResolver = async (_, args, context) => {
  try {
    const token = await validateToken(context.headers);

    if (token.status !== 200) {
      throw new Error(token.message);
    }

    const { id, title, description, price } = args;

    if (!id) {
      throw new Error("Id is required.");
    }

    if (!title) {
      throw new Error("Title is required.");
    }

    if (!description) {
      throw new Error("Description is required.");
    }

    if (!price) {
      throw new Error("Price is required.");
    }

    await updateRewardsById(id, title, description, price);

    return {
      success: true,
      message: "Reward updated successfully."
    };
  } catch (error) {
    throw new Error(error);
  }
};

const DeleteRewardResolver = async (_, args, context) => {
  try {
    const token = await validateToken(context.headers);

    if (token.status !== 200) {
      throw new Error(token.message);
    }

    const { id } = args;

    if (!id) {
      throw new Error("Id is required.");
    }

    await deleteRewardsById(id);

    await declineRedemptionRequestByRewardId(id);

    return {
      success: true,
      message: "Reward deleted successfully."
    };
  } catch (error) {
    throw new Error(error);
  }
};

const RedemptionRequestListResolver = async (_, args, context) => {
  try {
    const token = await validateToken(context.headers);

    if (token.status !== 200) {
      throw new Error(token.message);
    }

    const { slackTeamId } = token;

    const { pageIndex, pageSize } = args;

    const { data, totalCount, totalPages } = await paginateRedemptionRequests({
      pageIndex,
      pageSize,
      filter: {
        teamId: slackTeamId,
        status: RedemptionRequestStatus.PENDING
      }
    });

    return {
      data,
      totalCount,
      totalPages
    };
  } catch (error) {
    throw new Error(error);
  }
};

const CreateRedemptionRequestResolver = async (_, args, context) => {
  try {
    const token = await validateToken(context.headers);

    if (token.status !== 200) {
      throw new Error(token.message);
    }

    const { slackTeamId: teamId } = token;

    const { userId, rewardId } = args;

    if (!userId) {
      throw new Error("UserId is required.");
    }

    if (!rewardId) {
      throw new Error("RewardId is required.");
    }

    const user = await getUserDataById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    const reward = await getRewardById(rewardId);

    if (!reward) {
      throw new Error("Reward not found.");
    }

    const {
      slackUserData: { name: slackUsername }
    } = user;

    const { price } = reward;

    const cheersStat = await getCheersStatsForUser(teamId, slackUsername);

    if (!cheersStat) {
      throw new Error("You have not received any cheers yet.");
    }

    const { cheersRedeemable = 0 } = cheersStat;

    if (price > cheersRedeemable) {
      throw new Error("You don't have sufficient redeemable cheers.");
    }

    await addRedemptionRequest({
      teamId,
      user: userId,
      reward: rewardId,
      status: RedemptionRequestStatus.PENDING
    });

    await updateCheersStatsForUser(slackUsername, {
      cheersRedeemable: cheersRedeemable - price
    });

    return {
      success: true,
      message: "Redemption request created successfully."
    };
  } catch (error) {
    throw new Error(error);
  }
};

const SettleRedemptionRequestResolver = async (_, args, context) => {
  try {
    const token = await validateToken(context.headers);

    if (token.status !== 200) {
      throw new Error(token.message);
    }

    const { id } = args;

    if (!id) {
      throw new Error("Id is required.");
    }

    const redemptionRequest = await getRedemptionRequestById(id);

    if (!redemptionRequest) {
      throw new Error("Redemption request not found.");
    }

    const {
      user: {
        slackUserData: { id: channel, team_id }
      },
      reward: { title, price }
    } = redemptionRequest;

    await updateRedemptionRequestById(id, {
      status: RedemptionRequestStatus.SETTLED
    });

    // notify user in Slack

    await slackPostMessageToChannel(
      channel,
      team_id,
      createRedemptionRequestSettledTemplate({ title, price })
    );

    return {
      success: true,
      message: "Redemption request settled successfully."
    };
  } catch (error) {
    throw new Error(error);
  }
};

const DeclineRedemptionRequestResolver = async (_, args, context) => {
  try {
    const token = await validateToken(context.headers);

    if (token.status !== 200) {
      throw new Error(token.message);
    }

    const { slackTeamId } = token;

    const { id } = args;

    if (!id) {
      throw new Error("Id is required.");
    }

    const redemptionRequest = await getRedemptionRequestById(id);

    if (!redemptionRequest) {
      throw new Error("Redemption request not found.");
    }

    const {
      user: {
        slackUserData: { id: channel, name: slackUsername }
      },
      reward: { title, price }
    } = redemptionRequest;

    const cheersStat = await getCheersStatsForUser(slackTeamId, slackUsername);

    if (!cheersStat) {
      throw new Error("Cheers not found for user.");
    }

    await updateRedemptionRequestById(id, {
      status: RedemptionRequestStatus.DECLINED
    });

    const { cheersRedeemable } = cheersStat;

    await updateCheersStatsForUser(slackUsername, {
      cheersRedeemable: cheersRedeemable + price
    });

    // notify user in Slack
    await slackPostMessageToChannel(
      channel,
      slackTeamId,
      createRedemptionRequestDeclinedTemplate({ title, price })
    );

    return {
      success: true,
      message: "Redemption request declined successfully."
    };
  } catch (error) {
    throw new Error(error);
  }
};

const RewardsHistoryListResolver = async (_, args, context) => {
  try {
    const token = await validateToken(context.headers);

    if (token.status !== 200) {
      throw new Error(token.message);
    }

    const { slackTeamId } = token;

    const { pageIndex, pageSize } = args;

    const { data, totalCount, totalPages } = await paginateRedemptionRequests({
      pageIndex,
      pageSize,
      filter: {
        teamId: slackTeamId,
        $or: [
          { status: RedemptionRequestStatus.DECLINED },
          { status: RedemptionRequestStatus.SETTLED }
        ]
      }
    });

    return {
      data,
      totalCount,
      totalPages
    };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  RewardListResolver,
  CreateRewardResolver,
  UpdateRewardResolver,
  DeleteRewardResolver,
  RedemptionRequestListResolver,
  CreateRedemptionRequestResolver,
  SettleRedemptionRequestResolver,
  DeclineRedemptionRequestResolver,
  RewardsHistoryListResolver
};
