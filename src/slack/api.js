const fetch = require("node-fetch");
const {
  SLACK_API,
  SLACK_CLIENT_ID,
  SLACK_CLIENT_SECRET
} = require("../global/config");
const {
  getAuthDataForSlackTeam,
  getSlackBotTokenForTeam
} = require("../mongo/helper/auth");
const logger = require("../global/logger");

//  SLACK API

const postMessage = async (messagePayload, bot_access_token) => {
  try {
    const req = await fetch(`${SLACK_API}/chat.postMessage`, {
      method: "POST",
      body: JSON.stringify(messagePayload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bot_access_token}`
      }
    });

    return await req.json();
  } catch (error) {
    logger.error(
      `postMessage() : Failed to post message -> messagePayload : ${JSON.stringify(
        messagePayload
      )} -> `,
      error
    );
  }
};

const openDialog = async (messagePayload, bot_access_token) => {
  try {
    const req = await fetch(`${SLACK_API}/dialog.open`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bot_access_token}`
      },
      body: JSON.stringify(messagePayload)
    });

    const res = await req.json();

    logger.debug("openDialog() -> res : ", res);

    return res;
  } catch (error) {
    logger.error(
      `openDialog() : Failed to open dialog -> messagePayload : ${JSON.stringify(
        messagePayload
      )} -> `,
      error
    );
  }
};

const getSlackUser = async (teamId, user) => {
  try {
    const bot_access_token = await getSlackBotTokenForTeam(teamId);

    const req = await fetch(
      `${SLACK_API}/users.info?token=${bot_access_token}&user=${user}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "x-www-form-urlencoded"
        }
      }
    );
    const res = await req.json();

    logger.debug("getSlackUser() -> res : ", res);

    const slackUser = res.user;

    return slackUser;
  } catch (error) {
    logger.error(`getSlackUser() : Failed for user ${user}`, error);
  }
};

const getSlackTokenForUser = async (code) => {
  try {
    const details = {
      client_id: SLACK_CLIENT_ID,
      client_secret: SLACK_CLIENT_SECRET,
      code
    };

    let formBody = [];
    for (const property in details) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(details[property]);
      formBody.push(`${encodedKey}=${encodedValue}`);
    }
    formBody = formBody.join("&");

    const req = await fetch(`${SLACK_API}/oauth.v2.access`, {
      method: "POST",
      body: formBody,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    const res = await req.json();

    logger.debug("getSlackTokenForUser() -> res : ", res);

    return res;
  } catch (error) {
    logger.error("getSlackTokenForUser() : ", error);
  }
};

const slackPostMessageToChannel = async (
  channel, // can be slack userId as well for DM
  teamId,
  message
) => {
  try {
    const bot_access_token = await getSlackBotTokenForTeam(teamId);

    const messagePayload = {
      channel
    };

    messagePayload.blocks = message;

    const response = await postMessage(messagePayload, bot_access_token);

    logger.debug("slackPostMessageToChannel() -> response : ", response);

    return response;
  } catch (error) {
    logger.error(
      `slackPostMessageToChannel() : Failed to post message to channel ${channel} for user ${teamId} -> `,
      error
    );
  }
};

const openModal = async (teamId, trigger_id, view) => {
  try {
    const payload = { trigger_id, view };

    const bot_access_token = await getSlackBotTokenForTeam(teamId);

    const req = await fetch(`${SLACK_API}/views.open`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bot_access_token}`
      }
    });

    const res = await req.json();

    logger.debug("openModal() -> res : ", res);

    return res;
  } catch (error) {
    logger.error("openModal() -> error : ", error);
  }
};

const conversationsInvite = async (teamId, channel) => {
  try {
    const bot_access_token = await getSlackBotTokenForTeam(teamId);

    const req = await fetch(`${SLACK_API}/conversations.join`, {
      method: "POST",
      body: JSON.stringify({ channel }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bot_access_token}`
      }
    });

    const res = await req.json();

    logger.debug("conversationsInvite() -> res : ", res);

    return res;
  } catch (error) {
    logger.error("conversationsInvite() -> error : ", error);
  }
};

const postInternalMessage = async (teamId, channel, message) => {
  try {
    const bot_access_token = await getSlackBotTokenForTeam(teamId);

    const messagePayload = {
      channel,
      blocks: message
    };

    const response = await postMessage(messagePayload, bot_access_token);

    logger.debug("postInternalMessage() -> response : ", response);

    return response;
  } catch (error) {
    logger.error("postInternalMessage() -> error : ", error);
  }
};

const postMessageToHook = async (teamId, message) => {
  try {
    const auth = await getAuthDataForSlackTeam(teamId);

    const {
      slackInstallation: {
        incoming_webhook: { url }
      }
    } = auth;

    const messagePayload = {
      blocks: message
    };

    const req = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(messagePayload)
    });

    const res = await req.text();

    logger.debug("postMessageToHook() -> res : ", res);

    return res;
  } catch (error) {
    logger.error("postMessageToHook() -> error : ", error);
  }
};

const publishView = async (teamId, user_id, view) => {
  try {
    const bot_access_token = await getSlackBotTokenForTeam(teamId);

    const req = await fetch(`${SLACK_API}/views.publish`, {
      method: "POST",
      body: JSON.stringify({ user_id, view }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bot_access_token}`
      }
    });

    const res = await req.json();

    logger.debug("publishView() -> res : ", res);

    return res;
  } catch (error) {
    logger.error("publishView() -> error : ", error);
  }
};

const updateChat = async (teamId, channel, ts, blocks) => {
  try {
    const bot_access_token = await getSlackBotTokenForTeam(teamId);

    const req = await fetch(`${SLACK_API}/chat.update`, {
      method: "POST",
      body: JSON.stringify({ channel, ts, blocks }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bot_access_token}`
      }
    });

    const res = await req.json();

    logger.debug("updateChat() -> res : ", res);

    return res;
  } catch (error) {
    logger.error("updateChat() -> error : ", error);
  }
};

module.exports = {
  getSlackUser,
  getSlackTokenForUser,
  slackPostMessageToChannel,
  openModal,
  openDialog,
  postInternalMessage,
  postMessageToHook,
  conversationsInvite,
  publishView,
  updateChat
};