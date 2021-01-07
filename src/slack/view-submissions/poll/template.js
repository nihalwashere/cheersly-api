const createPollSubmittedTemplate = (user_name, pollQuestion, pollDuration) => {
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
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "A) *Yes*"
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "Poll",
          emoji: true
        },
        value: "click_me_123",
        action_id: "button-action"
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "B) *No*"
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "Poll",
          emoji: true
        },
        value: "click_me_123",
        action_id: "button-action"
      }
    },
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
