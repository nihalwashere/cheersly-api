const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 7000;

const {
  LOG_LEVEL,
  GIPHY_API,
  GIPHY_API_KEY,
  INTERNAL_SLACK_TEAM_ID,
  INTERNAL_SLACK_CHANNEL_ID,
  SLACK_API,
  SLACK_APP_ID,
  SLACK_CLIENT_ID,
  SLACK_CLIENT_SECRET,
  SLACK_SIGNING_SECRET,
  MONGO_URL,
  APP_NAME,
} = process.env;

const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

module.exports = {
  LOG_LEVEL,
  GIPHY_API,
  GIPHY_API_KEY,
  INTERNAL_SLACK_TEAM_ID,
  INTERNAL_SLACK_CHANNEL_ID,
  MONGO_URL,
  SLACK_API,
  SLACK_APP_ID,
  SLACK_CLIENT_ID,
  SLACK_CLIENT_SECRET,
  SLACK_SIGNING_SECRET,
  PORT,
  MONGO_OPTIONS,
  APP_NAME,
};
