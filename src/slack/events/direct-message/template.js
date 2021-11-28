const createDirectMessageHelpTemplate = () => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Hey there! :wave: \n You can use the command `/cheers help` to learn about usage or contact support@cheersly.club to get in touch with us!"
      }
    }
  ];
};

module.exports = {
  createDirectMessageHelpTemplate
};
