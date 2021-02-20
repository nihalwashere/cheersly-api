const R = require("ramda");
const { sortLeaders } = require("../../utils/common");
const logger = require("../../global/logger");

const processTopCheersReceivers = (cheers) => {
  const leaders = [];

  const uniqueUsers = [];

  cheers.map((cheer) => {
    const foundUser = uniqueUsers.find((user) => user === cheer.to);

    if (!foundUser) {
      uniqueUsers.push(cheer.to);
    }
  });

  logger.debug("uniqueUsers : ", uniqueUsers);

  // count cheers for each unique user

  uniqueUsers.map((user) => {
    let cheersReceived = 0;

    cheers.map((cheer) => {
      if (cheer.to === user) {
        cheersReceived += 1;
      }
    });

    leaders.push({ slackUserName: user, cheersReceived });
  });

  const sortedLeaders = sortLeaders(leaders);

  return sortedLeaders;
};

module.exports = { processTopCheersReceivers };
