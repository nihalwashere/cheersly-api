// SLACK EVENTS
const APP_MENTION = "app_mention";
const APP_HOME_OPENED = "app_home_opened";
const APP_UNINSTALLED = "app_uninstalled";
const TOKENS_REVOKED = "tokens_revoked";
const MESSAGE = "message";

// channel type
const IM_CHANNEL_TYPE = "im";

const VIEW_SUBMISSIONS = {
  POLL: "POLL",
  SAY_CHEERS: "SAY_CHEERS",
  CUSTOMER_FEEDBACK: "CUSTOMER_FEEDBACK",
  FEEDBACK: "FEEDBACK"
};

const BLOCK_IDS = {
  POLL_QUESTION: "POLL_QUESTION",
  SELECT_POLL_CHANNEL: "SELECT_POLL_CHANNEL",
  SELECT_DURATION: "SELECT_DURATION",
  POLL_IS_ANONYMOUS: "POLL_IS_ANONYMOUS",
  POLL_OPTION_A: "POLL_OPTION_A",
  POLL_OPTION_B: "POLL_OPTION_B",
  POLL_OPTION_C: "POLL_OPTION_C",
  POLL_OPTION_D: "POLL_OPTION_D",
  SUBMIT_CHEERS_TO_USERS: "SUBMIT_CHEERS_TO_USERS",
  SUBMIT_CHEERS_TO_CHANNEL: "SUBMIT_CHEERS_TO_CHANNEL",
  SUBMIT_CHEERS_FOR_COMPANY_VALUES: "SUBMIT_CHEERS_FOR_COMPANY_VALUES",
  SUBMIT_CHEERS_FOR_REASON: "SUBMIT_CHEERS_FOR_REASON",
  SHOULD_SHARE_GIPHY: "SHOULD_SHARE_GIPHY",
  SELECT_OPTION_FOR_FEEDBACK: "SELECT_OPTION_FOR_FEEDBACK",
  CUSTOMER_FEEDBACK_DESCRIPTION: "CUSTOMER_FEEDBACK_DESCRIPTION",
  FEEDBACK_DESCRIPTION: "FEEDBACK_DESCRIPTION",
  FEEDBACK_CHANNEL: "FEEDBACK_CHANNEL",
  FEEDBACK_IS_ANONYMOUS: "FEEDBACK_IS_ANONYMOUS",
  STONE_PAPER_SCISSORS: "STONE_PAPER_SCISSORS"
};

const ACTION_IDS = {
  POLL_QUESTION_VALUE: "POLL_QUESTION_VALUE",
  SELECTED_POLL_CHANNEL: "SELECTED_POLL_CHANNEL",
  SELECTED_DURATION: "SELECTED_DURATION",
  POLL_IS_ANONYMOUS_VALUE: "POLL_IS_ANONYMOUS_VALUE",
  POLL_OPTION_A_VALUE: "POLL_OPTION_A_VALUE",
  POLL_OPTION_B_VALUE: "POLL_OPTION_B_VALUE",
  POLL_OPTION_C_VALUE: "POLL_OPTION_C_VALUE",
  POLL_OPTION_D_VALUE: "POLL_OPTION_D_VALUE",
  SUBMIT_CHEERS_TO_USERS_VALUE: "SUBMIT_CHEERS_TO_USERS_VALUE",
  SUBMIT_CHEERS_TO_CHANNEL_VALUE: "SUBMIT_CHEERS_TO_CHANNEL_VALUE",
  SUBMIT_CHEERS_FOR_COMPANY_VALUES_VALUE:
    "SUBMIT_CHEERS_FOR_COMPANY_VALUES_VALUE",
  SUBMIT_CHEERS_FOR_REASON_VALUE: "SUBMIT_CHEERS_FOR_REASON_VALUE",
  SHOULD_SHARE_GIPHY_VALUE: "SHOULD_SHARE_GIPHY_VALUE",
  SELECTED_OPTION_FOR_FEEDBACK: "SELECTED_OPTION_FOR_FEEDBACK",
  CUSTOMER_FEEDBACK_DESCRIPTION_TEXT: "CUSTOMER_FEEDBACK_DESCRIPTION_TEXT",
  FEEDBACK_DESCRIPTION_VALUE: "FEEDBACK_DESCRIPTION_VALUE",
  FEEDBACK_CHANNEL_VALUE: "FEEDBACK_CHANNEL_VALUE",
  FEEDBACK_IS_ANONYMOUS_VALUE: "FEEDBACK_IS_ANONYMOUS_VALUE",
  STONE_PLAYED: "STONE_PLAYED",
  PAPER_PLAYED: "PAPER_PLAYED",
  SCISSORS_PLAYED: "SCISSORS_PLAYED"
};

const SLACK_ACTIONS = {
  SHORTCUT: "shortcut",
  BLOCK_ACTIONS: "block_actions",
  VIEW_SUBMISSION: "view_submission",
  BLOCK_SUGGESTION: "block_suggestion",
  POLL_OPTION_SUBMITTED: "POLL_OPTION_SUBMITTED",
  CUSTOMER_FEEDBACK: "CUSTOMER_FEEDBACK",
  SAY_CHEERS: "SAY_CHEERS"
};

const CUSTOMER_FEEDBACK_OPTIONS = {
  HELP_WITH_GETTING_STARTED: "HELP_WITH_GETTING_STARTED",
  REQUEST_A_FEATURE: "REQUEST_A_FEATURE",
  RAISE_A_BUG: "RAISE_A_BUG",
  FEEDBACK: "FEEDBACK",
  SOMETHING_ELSE: "SOMETHING_ELSE"
};

const DEFAULT_TIME_ZONE = "America/Los_Angeles";

const SHORTCUTS = {
  POLL: "POLL",
  FEEDBACK: "FEEDBACK",
  CHEERS: "CHEERS"
};

const PROD_APP_URL = "https://app.cheersly.club";

const DEV_APP_URL = "https://app-dev.cheersly.club";

const COLOR = "ff8c00";

module.exports = {
  APP_HOME_OPENED,
  APP_UNINSTALLED,
  TOKENS_REVOKED,
  APP_MENTION,
  MESSAGE,
  IM_CHANNEL_TYPE,
  VIEW_SUBMISSIONS,
  BLOCK_IDS,
  ACTION_IDS,
  SLACK_ACTIONS,
  DEFAULT_TIME_ZONE,
  CUSTOMER_FEEDBACK_OPTIONS,
  SHORTCUTS,
  PROD_APP_URL,
  DEV_APP_URL,
  COLOR
};
