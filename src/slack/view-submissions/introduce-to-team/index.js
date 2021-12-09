const { slackPostMessageToChannel } = require("../../api");
const {
  BLOCK_IDS: { INTRODUCE_TO_TEAM_CHANNEL, INTRODUCE_TO_TEAM_MESSAGE },
  ACTION_IDS: {
    INTRODUCE_TO_TEAM_CHANNEL_VALUE,
    INTRODUCE_TO_TEAM_MESSAGE_VALUE,
  },
} = require("../../../global/constants");
const { createIntroduceToTeamMessageTemplate } = require("./template");
const { getAppHomeUrl } = require("../../../utils/common");
const logger = require("../../../global/logger");

const processIntroduceToTeam = async payload => {
  try {
    const {
      user: { id: userId },
      team: { id: teamId },
      view: { state },
    } = payload;

    const channel =
      state.values[INTRODUCE_TO_TEAM_CHANNEL][INTRODUCE_TO_TEAM_CHANNEL_VALUE]
        .selected_conversation;

    const message =
      state.values[INTRODUCE_TO_TEAM_MESSAGE][INTRODUCE_TO_TEAM_MESSAGE_VALUE]
        .value;

    await slackPostMessageToChannel(
      channel,
      teamId,
      createIntroduceToTeamMessageTemplate(
        message,
        userId,
        getAppHomeUrl(teamId)
      )
    );
  } catch (error) {
    logger.error("processIntroduceToTeam() -> error : ", error);
  }
};

module.exports = { processIntroduceToTeam };
