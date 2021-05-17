const RedemptionRequests = require("../models/RedemptionRequests");
const logger = require("../../global/logger");
const {
  RedemptionRequestStatus
} = require("../../enums/redemptionRequestStatus");

const getRedemptionRequestsByTeamId = async (teamId) => {
  try {
    return await RedemptionRequests.find({ teamId });
  } catch (error) {
    logger.error(`getRedemptionRequestsByTeamId() -> error : `, error);
  }
};

const addRedemptionRequest = async (payload) => {
  try {
    return await new RedemptionRequests(payload).save();
  } catch (error) {
    logger.error(`addRedemptionRequest() -> error : `, error);
  }
};

const getRedemptionRequestById = async (_id) => {
  try {
    return await RedemptionRequests.findOne({ _id }).populate("user reward");
  } catch (error) {
    logger.error(`getRedemptionRequestById() -> error : `, error);
  }
};

const updateRedemptionRequestById = async (_id, payload) => {
  try {
    return await RedemptionRequests.updateOne(
      { _id },
      {
        $set: {
          ...payload
        }
      }
    );
  } catch (error) {
    logger.error(`updateRedemptionRequestById() -> error : `, error);
  }
};

const paginateRedemptionRequests = async ({ pageIndex, pageSize, filter }) => {
  try {
    const totalCount = await RedemptionRequests.find({
      ...filter
    }).countDocuments({});

    const data = await RedemptionRequests.find({
      ...filter
    })
      .populate("user reward")
      .sort({ createdAt: -1 })
      .skip(pageSize * pageIndex)
      .limit(pageSize);

    return {
      data,
      totalCount: Number(totalCount),
      totalPages: Math.ceil(totalCount / pageSize)
    };
  } catch (error) {
    logger.error(`paginateRedemptionRequests() -> error : `, error);
  }
};

const declineRedemptionRequestByRewardId = async (reward) => {
  try {
    return await RedemptionRequests.updateMany(
      { reward },
      { $set: { status: RedemptionRequestStatus.DECLINED } }
    );
  } catch (error) {
    logger.error(`declineRedemptionRequestByRewardId() -> error : `, error);
  }
};

module.exports = {
  getRedemptionRequestsByTeamId,
  addRedemptionRequest,
  getRedemptionRequestById,
  updateRedemptionRequestById,
  paginateRedemptionRequests,
  declineRedemptionRequestByRewardId
};
