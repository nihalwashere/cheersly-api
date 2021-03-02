const R = require("ramda");
const moment = require("moment-timezone");
const { getCheersForTeam } = require("../../mongo/helper/cheers");
const { getUserDataBySlackUserName } = require("../../mongo/helper/user");
const { validateToken } = require("../../utils/common");
const { TYPES } = require("../../enums/leaderBoardFilters");

const getUniqueUsers = (users) => R.uniq(users);

const paginate = (data, page_size, page_number) =>
  data.slice((page_number - 1) * page_size, page_number * page_size);

const sortByKey = (data, sortKey, sortOrder) => {
  const withData = data.filter(
    (obj) =>
      obj[sortKey] !== undefined && obj[sortKey] !== null && obj[sortKey] !== ""
  );

  const withoutData = data.filter(
    (obj) =>
      obj[sortKey] === undefined || obj[sortKey] === null || obj[sortKey] === ""
  );

  const sortedData = withData.sort((a, b) => {
    if (sortOrder === "asc") {
      return Number(a[sortKey]) > Number(b[sortKey]) ? 1 : -1;
    }

    return Number(a[sortKey]) < Number(b[sortKey]) ? 1 : -1;
  });

  return sortedData.concat(withoutData);
};

const resolveDuration = (duration) => {
  const mapper = {
    CURRENT_WEEK: () => ({
      from: moment().startOf("weeks").toDate(),
      to: moment().toDate()
    }),
    PAST_WEEK: () => ({
      from: moment().subtract(1, "weeks").startOf("weeks").toDate(),
      to: moment().subtract(1, "weeks").endOf("weeks").toDate()
    }),
    PAST_2_WEEKS: () => ({
      from: moment().subtract(2, "weeks").startOf("weeks").toDate(),
      to: moment().subtract(1, "weeks").endOf("weeks").toDate()
    }),
    PAST_3_WEEKS: () => ({
      from: moment().subtract(3, "weeks").startOf("weeks").toDate(),
      to: moment().subtract(1, "weeks").endOf("weeks").toDate()
    }),
    LAST_MONTH: () => ({
      from: moment().subtract(1, "months").startOf("month").toDate(),
      to: moment().subtract(1, "months").endOf("month").toDate()
    }),
    LAST_2_MONTHS: () => ({
      from: moment().subtract(2, "months").startOf("month").toDate(),
      to: moment().subtract(1, "months").endOf("month").toDate()
    }),
    LAST_3_MONTHS: () => ({
      from: moment().subtract(3, "months").startOf("month").toDate(),
      to: moment().subtract(1, "months").endOf("month").toDate()
    }),
    LAST_6_MONTHS: () => ({
      from: moment().subtract(6, "months").startOf("month").toDate(),
      to: moment().subtract(1, "months").endOf("month").toDate()
    }),
    ALL_TIME: () => ({
      from: null,
      to: null
    })
  };

  const applyMapper = mapper[duration];

  return applyMapper
    ? applyMapper()
    : {
        from: "",
        to: ""
      };
};

const findLeaders = (cheers) => {
  const cheerGivers = [];
  const cheerReceivers = [];

  const uniqueCheerGivers = [];
  const uniqueCheerReceivers = [];

  // cheers given

  cheers.map((cheer) => {
    const foundUser = uniqueCheerGivers.find((user) => user === cheer.from);

    if (!foundUser) {
      uniqueCheerGivers.push(cheer.from);
    }
  });

  uniqueCheerGivers.map((user) => {
    let cheersGiven = 0;

    cheers.map((cheer) => {
      if (cheer.from === user) {
        cheersGiven += 1;
      }
    });

    cheerGivers.push({ slackUserName: user, cheersGiven });
  });

  // cheers received

  cheers.map((cheer) => {
    const foundUser = uniqueCheerReceivers.find((user) => user === cheer.to);

    if (!foundUser) {
      uniqueCheerReceivers.push(cheer.to);
    }
  });

  uniqueCheerReceivers.map((user) => {
    let cheersReceived = 0;

    cheers.map((cheer) => {
      if (cheer.to === user) {
        cheersReceived += 1;
      }
    });

    cheerReceivers.push({ slackUserName: user, cheersReceived });
  });

  let uniqueUsers = uniqueCheerGivers.concat(uniqueCheerReceivers);
  uniqueUsers = R.uniq(uniqueUsers);

  const leaders = [];

  uniqueUsers.map((user) => {
    const hasGivenCheers = cheerGivers.find(
      (cheer) => cheer.slackUserName === user
    );

    const hasReceivedCheers = cheerReceivers.find(
      (cheer) => cheer.slackUserName === user
    );

    if (hasGivenCheers && hasReceivedCheers) {
      leaders.push({
        slackUserName: user,
        cheersGiven: hasGivenCheers.cheersGiven,
        cheersReceived: hasReceivedCheers.cheersReceived
      });
    }

    if (!hasGivenCheers && hasReceivedCheers) {
      leaders.push({
        slackUserName: user,
        cheersGiven: 0,
        cheersReceived: hasReceivedCheers.cheersReceived
      });
    }

    if (hasGivenCheers && !hasReceivedCheers) {
      leaders.push({
        slackUserName: user,
        cheersGiven: hasGivenCheers.cheersGiven,
        cheersReceived: 0
      });
    }
  });

  return leaders;
};

const LeaderBoardListResolver = async (_, args, context) => {
  try {
    const token = await validateToken(context.headers);

    if (token.status !== 200) {
      throw new Error(token.message);
    }

    const { slackTeamId } = token;

    const { pageIndex, pageSize, type, duration } = args;

    const { from, to } = resolveDuration(duration);

    const cheersForTeam = await getCheersForTeam(slackTeamId, from, to);

    const leaders = findLeaders(cheersForTeam);

    const data = paginate(leaders, pageSize, pageIndex);

    const totalCount = leaders.length;

    const mappedData = [];

    await Promise.all(
      data.map(async (item) => {
        const { slackUserName, cheersGiven, cheersReceived } = item;

        const slackUserData = await getUserDataBySlackUserName(slackUserName);

        if (slackUserData) {
          mappedData.push({
            slackUser: slackUserData,
            cheersGiven,
            cheersReceived
          });
        }
      })
    );

    let sortedData = [];

    if (type === TYPES.CHEERS_RECEIVED) {
      sortedData = sortByKey(mappedData, "cheersReceived", "desc");
    }

    if (type === TYPES.CHEERS_GIVEN) {
      sortedData = sortByKey(mappedData, "cheersGiven", "desc");
    }

    return {
      data: sortedData,
      totalCount: Number(totalCount),
      totalPages: Math.ceil(totalCount / pageSize)
    };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { LeaderBoardListResolver };
