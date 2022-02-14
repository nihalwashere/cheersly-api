const { getChannelDeepLink } = require("../../../utils/common");

const createChannelNotSetupTemplate = (teamId, recognitionTeams) => {
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*Oops!* You haven't setup this channel to be used to share cheers with your peers.",
      },
    },
  ];

  if (recognitionTeams.length) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Here are the channels you can share cheers in,\n${recognitionTeams
          .map(
            elem =>
              `<${getChannelDeepLink(teamId, elem.channel)}|#${elem.channel}>`
          )
          .join(", ")
          .replace(/, ([^,]*)$/, " and $1")}`,
      },
    });
  }

  return blocks;
};

module.exports = { createChannelNotSetupTemplate };
