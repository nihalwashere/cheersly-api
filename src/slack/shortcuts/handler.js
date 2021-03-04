const {
  SHORTCUTS: { POLL, FEEDBACK, CHEERS }
} = require("../../global/constants");
const { processPollShortcut } = require("./poll");
const { processFeedbackShortcut } = require("./feedback");
const { processCheersShortcut } = require("./cheers");

const logger = require("../../global/logger");

const shortcutsMapper = async (callback_id, payload) => {
  try {
    const mapper = {
      [POLL]: async () => await processPollShortcut(payload),
      [FEEDBACK]: async () => await processFeedbackShortcut(payload),
      [CHEERS]: async () => await processCheersShortcut(payload)
    };

    const applyMapper = mapper[callback_id];
    return applyMapper ? applyMapper() : null;
  } catch (error) {
    logger.error("shortcutsMapper() -> error : ", error);
  }
};

const shortcutsHandler = async (payload) => {
  try {
    logger.info("shortcutsHandler");
    const { callback_id } = payload;

    if (callback_id) {
      await shortcutsMapper(callback_id, payload);
    }
  } catch (error) {
    logger.error("shortcutsHandler() -> error : ", error);
  }
};

module.exports = { shortcutsHandler };
