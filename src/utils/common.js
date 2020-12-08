const crypto = require("crypto");
const qs = require("qs");
const logger = require("../global/logger");

const verifySlackRequest = (slackRequestTimestamp, slackSignature, body) => {
  try {
    const currentTime = Math.floor(new Date().getTime() / 1000);
    if (Math.abs(currentTime - slackRequestTimestamp) > 5 * 60) {
      return {
        error: true,
        status: 403,
        message: "You can't replay me!",
      };
    }

    const baseString = `v0:${slackRequestTimestamp}:${qs.stringify(body, {
      format: "RFC1738",
    })}`;

    // logger.debug("baseString : ", baseString);

    const hmac = crypto.createHmac("sha256", process.env.SLACK_SIGNING_SECRET);

    hmac.update(baseString);

    const digest = hmac.digest("hex");

    const appSignature = `v0=${digest}`;

    // logger.debug("appSignature : ", appSignature);

    if (slackSignature !== appSignature) {
      return {
        error: true,
        status: 403,
        message: "Nice try buddy!",
      };
    }

    return {
      error: false,
    };
  } catch (error) {
    logger.error("verifySlackRequest() -> error : ", error);
  }
};

module.exports = { verifySlackRequest };
