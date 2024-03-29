const {
  VIEW_SUBMISSIONS: {
    POLL,
    CUSTOMER_FEEDBACK,
    FEEDBACK,
    SAY_CHEERS,
    ADD_NEW_INTEREST,
    START_THIS_OR_THAT,
    START_ICEBREAKER_QUESTION,
    START_TWO_TRUTHS_AND_A_LIE,
    INTRODUCE_TO_TEAM,
  },
} = require("../../global/constants");
const { processPoll } = require("./poll");
const { processCustomerFeedback } = require("./customer-feedback");
const { processFeedback } = require("./feedback");
const { processCheers } = require("./cheers");
const { processAddNewInterest } = require("./add-new-interest");
const { processStartThisOrThat } = require("./start-this-or-that");
const {
  processStartIcebreakerQuestion,
} = require("./start-icebreaker-question");
const {
  processStartTwoTruthsAndALie,
} = require("./start-two-truths-and-a-lie");
const { processIntroduceToTeam } = require("./introduce-to-team");
const logger = require("../../global/logger");

const submissionsMapper = async (callback_id, payload) => {
  try {
    const mapper = {
      [POLL]: () => processPoll(payload),
      [CUSTOMER_FEEDBACK]: () => processCustomerFeedback(payload),
      [FEEDBACK]: () => processFeedback(payload),
      [SAY_CHEERS]: () => processCheers(payload),
      [ADD_NEW_INTEREST]: () => processAddNewInterest(payload),
      [START_THIS_OR_THAT]: () => processStartThisOrThat(payload),
      [START_ICEBREAKER_QUESTION]: () =>
        processStartIcebreakerQuestion(payload),
      [START_TWO_TRUTHS_AND_A_LIE]: () => processStartTwoTruthsAndALie(payload),
      [INTRODUCE_TO_TEAM]: () => processIntroduceToTeam(payload),
    };

    const applyMapper = mapper[callback_id];

    return applyMapper ? applyMapper() : null;
  } catch (error) {
    logger.error("submissionsMapper() -> error : ", error);
  }
};

const viewSubmissionHandler = async payload => {
  try {
    const {
      view: { callback_id },
    } = payload;

    if (callback_id) {
      return await submissionsMapper(callback_id, payload);
    }
  } catch (error) {
    logger.error("viewSubmissionHandler() -> error : ", error);
  }
};

module.exports = { viewSubmissionHandler };
