const { getChannelString } = require("../../../utils/common");

const createChannelNotSetupTemplate = (teamId, recognitionTeams) => {
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*Oops!* You haven't setup this channel to share cheers with your peers.",
      },
    },
  ];

  if (recognitionTeams.length) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Here are the channels you can share cheers in,\n${getChannelString(
          teamId,
          recognitionTeams
        )}`,
      },
    });
  }

  return blocks;
};

module.exports = { createChannelNotSetupTemplate };
