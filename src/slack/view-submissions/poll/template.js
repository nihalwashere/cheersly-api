const {
  SLACK_ACTIONS: { POLL_OPTION_SUBMITTED }
} = require("../../../global/constants");

const createPollOptionBlocks = (pollId, pollOptions) => {
  const pollOptionBlocks = [];

  pollOptions.map((option, index) => {
    let optionIndex = "";

    switch (index) {
      case 0:
        optionIndex = "A";
        break;

      case 1:
        optionIndex = "B";
        break;

      case 2:
        optionIndex = "C";
        break;

      case 3:
        optionIndex = "D";
        break;

      default:
        break;
    }

    pollOptionBlocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `${optionIndex}) *${option}*`
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "Poll",
          emoji: true
        },
        value: `${pollId}-----${optionIndex}`,
        action_id: POLL_OPTION_SUBMITTED
      }
    });
  });

  return pollOptionBlocks;
};

const createPollSubmittedTemplate = (
  pollId,
  user_name,
  pollQuestion,
  pollDuration,
  pollOptions
) => {
  let pollDurationString = "";

  const pollDurationNumber = Number(pollDuration);

  if (pollDurationNumber > 60) {
    pollDurationString = `${pollDurationNumber / 60} hours`;
  } else {
    pollDurationString = `${pollDurationNumber} mins`;
  }

  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `@${user_name} submitted a Poll`
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Question: *${pollQuestion}*`
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Options :"
      }
    },
    ...createPollOptionBlocks(pollId, pollOptions),
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `_*Polling will close after ${pollDurationString}*_`
      }
    }
  ];
};

module.exports = { createPollSubmittedTemplate };
