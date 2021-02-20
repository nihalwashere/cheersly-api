const moment = require("moment-timezone");
const { getMedalType } = require("../../utils/common");

const createTopSection = () => ({
  type: "section",
  text: {
    type: "mrkdwn",
    text: "*Top Cheer Receivers*"
  }
});

const createFromSection = (from, to) => {
  if (!from && !to) {
    return {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*All time*"
      }
    };
  }

  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        "_From " +
        moment(from).format("Do MMM") +
        "  To " +
        moment(to).format("Do MMM") +
        "_"
    }
  };
};

const createTopCheersReceiversSection = (cheers) => {
  const cheerReceivers = [];

  if (cheers.length === 0) {
    // no cheers receivers

    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "No cheers shared during this period :cry:"
        }
      }
    ];
  }

  for (let i = 0; i < 3; i++) {
    if (cheers[i]) {
      const { slackUserName, cheersReceived } = cheers[i];

      cheerReceivers.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            getMedalType(i) +
            " @" +
            slackUserName +
            "  (" +
            cheersReceived +
            ")"
        }
      });
    }
  }

  return cheerReceivers;
};

const createStatsTemplate = (cheers, from, to) => {
  return [
    createTopSection(),
    createFromSection(from, to),
    ...createTopCheersReceiversSection(cheers)
  ];
};

module.exports = { createStatsTemplate };
