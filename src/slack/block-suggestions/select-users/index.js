const { getUsersForTeam } = require("../../../mongo/helper/user");
const logger = require("../../../global/logger");

const getUsersOptions = (users) => {
  const usersOptions = [];

  users.map((user) => {
    const {
      slackUserData: { real_name, name }
    } = user;

    usersOptions.push({
      text: {
        type: "plain_text",
        text: real_name
      },
      value: name
    });
  });

  return usersOptions;
};

const handleSelectUsersSuggestions = async (payload) => {
  try {
    logger.debug("handleSelectUsersSuggestions");

    const {
      team: { id: teamId }
    } = payload;

    const usersForTeam = await getUsersForTeam(teamId);
    logger.debug("usersForTeam : ", usersForTeam);

    const users = usersForTeam.filter(
      (user) =>
        !user.slackUserData.deleted &&
        !user.slackUserData.is_bot &&
        user.slackUserData.name !== "slackbot"
    );

    const options = getUsersOptions(users);

    logger.debug("options : ", JSON.stringify(options));

    // return options
    return {
      options
    };
  } catch (error) {
    logger.error("handleSelectUsersSuggestions() -> error : ", error);
  }
};

module.exports = { handleSelectUsersSuggestions };
