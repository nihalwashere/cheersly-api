const createMovePlayedTemplate = () => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Paper Played"
      }
    }
  ];
};

module.exports = { createMovePlayedTemplate };
