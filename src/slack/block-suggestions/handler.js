const {
  BLOCK_IDS: { SELECT_USERS }
} = require("../../global/constants");
const { handleSelectUsersSuggestions } = require("./select-users");
const logger = require("../../global/logger");

const suggestionsMapper = async (block_id, payload) => {
  try {
    const mapper = {
      [SELECT_USERS]: async () => {
        return await handleSelectUsersSuggestions(payload);
      }
    };

    const applyMapper = mapper[block_id];
    return applyMapper ? applyMapper() : null;
  } catch (error) {
    logger.error("submissionsMapper() -> error : ", error);
  }
};

const blockSuggestionsHandler = async (payload) => {
  try {
    logger.debug("blockSuggestionsHandler");

    const { block_id } = payload;

    logger.debug("block_id : ", block_id);

    if (block_id) {
      return await suggestionsMapper(block_id, payload);
    }
  } catch (error) {
    logger.error("blockSuggestionsHandler() -> error : ", error);
  }
};

module.exports = { blockSuggestionsHandler };
