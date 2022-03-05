const fetch = require("node-fetch");
const RecognitionTeamsModel = require("../../mongo/models/RecognitionTeams");
const UserModel = require("../../mongo/models/User");
const { SLACK_API } = require("../../global/config");
const { upsertUser } = require("../../mongo/helper/user");
const UserRoles = require("../../enums/userRoles");
const { getSlackBotTokenForTeam } = require("../../mongo/helper/auth");
const { getSlackUser } = require("../api");
const logger = require("../../global/logger");

const LIMIT = 100;

// HELPERS

const syncMembers = async (teamId, members) => {
  const syncedMembers = [];

  await Promise.all(
    members.map(async member => {
      const user = await UserModel.findOne({ "slackUserData.id": member });

      if (!user) {
        // sync new user
        const slackUserData = await getSlackUser(teamId, member);

        if (
          !slackUserData.deleted &&
          !slackUserData.is_bot &&
          slackUserData.name !== "slackbot"
        ) {
          // add new user

          const newUser = await new UserModel({
            slackUserData,
            slackDeleted: false,
            appHomePublished: false,
            role: slackUserData.is_admin ? UserRoles.ADMIN : UserRoles.MEMBER,
          }).save();

          syncedMembers.push(newUser._id);
        }
      } else {
        syncedMembers.push(user._id);
      }
    })
  );

  return syncedMembers;
};

const getMembers = async (token, channelId, next_cursor) => {
  try {
    let url = `${SLACK_API}/conversations.members?channel=${channelId}&limit=${LIMIT}`;

    if (next_cursor) {
      url = `${SLACK_API}/conversations.members?channel=${channelId}&limit=${LIMIT}&cursor=${encodeURIComponent(
        next_cursor
      )}`;
    }

    const req = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await req.json();

    return res;
  } catch (error) {
    logger.error("getConversationMembers() -> error : ", error);
  }
};

const paginateMembers = async (
  token,
  channelId,
  next_cursor = null,
  members = []
) => {
  try {
    const result = await getMembers(token, channelId, next_cursor);
    logger.debug("result : ", result);

    if (!result.ok) {
      return [];
    }

    if (result.members) {
      result.members.map(elem => {
        members.push(elem);
      });
    }

    if (
      result &&
      result.response_metadata &&
      result.response_metadata.next_cursor
    ) {
      return await paginateMembers(
        token,
        channelId,
        result.response_metadata.next_cursor,
        members
      );
    }

    return members;
  } catch (error) {
    logger.error("paginateMembers() -> error : ", error);
  }
};

const getConversationMembers = async (teamId, recognitionTeamId, channelId) => {
  try {
    const botAccessToken = await getSlackBotTokenForTeam(teamId);

    const members = await paginateMembers(botAccessToken, channelId);

    const conversationMembers = await syncMembers(teamId, members);

    await RecognitionTeamsModel.findOneAndUpdate(
      {
        _id: recognitionTeamId,
        teamId,
      },
      {
        members: conversationMembers,
      }
    );
  } catch (error) {
    logger.error("getConversationMembers() -> error : ", error);
  }
};

module.exports = { getConversationMembers };
