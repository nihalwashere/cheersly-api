const {
  VIEW_SUBMISSIONS: { POLL }
} = require("../../global/constants");
const { processPoll } = require("./poll");
const logger = require("../../global/logger");

const submissionsMapper = async (callback_id, payload) => {
  try {
    const mapper = {
      [POLL]: async () => await processPoll(payload)
    };

    const applyMapper = mapper[callback_id];
    return applyMapper ? applyMapper() : null;
  } catch (error) {
    logger.error("submissionsMapper() -> error : ", error);
  }
};

const viewSubmissionHandler = async (payload) => {
  try {
    logger.info("viewSubmissionHandler");
    const {
      view: { callback_id }
    } = payload;

    if (callback_id) {
      await submissionsMapper(callback_id, payload);
    }
  } catch (error) {
    logger.error("viewSubmissionHandler() -> error : ", error);
  }
};

module.exports = { viewSubmissionHandler };