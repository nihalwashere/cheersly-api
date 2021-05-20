const RedemptionRequestStatus = {
  PENDING: "PENDING",
  DECLINED: "DECLINED",
  SETTLED: "SETTLED"
};

const getRedemptionRequestStatus = () => [
  RedemptionRequestStatus.PENDING,
  RedemptionRequestStatus.DECLINED,
  RedemptionRequestStatus.SETTLED
];

module.exports = {
  RedemptionRequestStatus,
  getRedemptionRequestStatus
};
