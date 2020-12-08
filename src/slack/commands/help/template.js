const createHelpTemplate = () => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "List of available commands :\n",
      },
    },
  ];
};

module.exports = { createHelpTemplate };
