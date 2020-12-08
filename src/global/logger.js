const log4js = require("log4js");
const { LOG_LEVEL } = require("./config");

const logger = log4js.getLogger();

logger.level = LOG_LEVEL;

module.exports = logger;
