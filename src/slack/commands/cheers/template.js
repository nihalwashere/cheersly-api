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

  let channelString = "";

  recognitionTeams.map((elem, index) => {
    channelString += `<${getChannelDeepLink(teamId, elem.channel)}|#${
      elem.channel
    }>${recognitionTeams.length === index + 1 ? "" : " ,"}`;
  });

  if (recognitionTeams.length) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Here are the channels you can share cheers in,\n${channelString}`,
      },
    });
  }

  return blocks;
};

module.exports = { createChannelNotSetupTemplate };
