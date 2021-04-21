const fetch = require("node-fetch");
const { SLACK_API } = require("../../global/config");
const logger = require("../../global/logger");
const { upsertUser } = require("../../mongo/helper/user");

const LIMIT = 100;

// HELPERS

const wrapMembers = (members) => {
  const wrappedMembers = [];

  members.map((member) => {
    if (!member.deleted && !member.is_bot && member.name !== "slackbot") {
      wrappedMembers.push({
        slackUserData: member,
        slackDeleted: false,
        appHomePublished: false
      });
    }
  });

  return wrappedMembers;
};

const addUsers = async (users) =>
  await Promise.all(
    users.map(async (user) => {
      await upsertUser(user.slackUserData.id, user);
    })
  );

const getUsersList = async (limit, token, next_cursor) => {
  try {
    let url = `${SLACK_API}/users.list?limit=${limit}`;

    if (next_cursor) {
      url = `${SLACK_API}/users.list?limit=${limit}&cursor=${encodeURIComponent(
        next_cursor
      )}`;
    }

    const req = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const res = await req.json();

    return res;
  } catch (error) {
    logger.error("getUsersList() -> error : ", error);
  }
};

const paginateUsersList = async (token, next_cursor = null) => {
  try {
    const result = await getUsersList(LIMIT, token, next_cursor);
    logger.debug("result : ", result);

    if (result.members && result.members.length) {
      await addUsers(wrapMembers(result.members));
    }

    if (
      result &&
      result.response_metadata &&
      result.response_metadata.next_cursor
    ) {
      return await paginateUsersList(
        token,
        result.response_metadata.next_cursor
      );
    }

    return { done: true };
  } catch (error) {
    logger.error("paginateUsersList() -> error : ", error);
  }
};

module.exports = { paginateUsersList };
