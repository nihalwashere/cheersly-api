const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 7000;

const {
  LOG_LEVEL,
  SLACK_API,
  SLACK_CLIENT_ID,
  SLACK_CLIENT_SECRET,
  SLACK_SIGNING_SECRET,
  MONGO_URL,
} = process.env;

module.exports = {
  LOG_LEVEL,
  MONGO_URL,
  SLACK_API,
  SLACK_CLIENT_ID,
  SLACK_CLIENT_SECRET,
  SLACK_SIGNING_SECRET,
  PORT,
};
