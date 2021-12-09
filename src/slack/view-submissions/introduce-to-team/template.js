const createIntroduceToTeamMessageTemplate = (message, userId, url) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: message,
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Explore Cheersly :beers:",
            emoji: true,
          },
          url,
        },
      ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `- <@${userId}>`,
      },
    },
  ];
};

module.exports = { createIntroduceToTeamMessageTemplate };
