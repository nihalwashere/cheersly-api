const { COLOR } = require("../../../global/constants");

const createPretext = (user_name, isAnonymous) => {
  let pretext = `*@${user_name} shared a feedback*`;

  if (isAnonymous) {
    pretext = "*Someone shared a feedback*";
  }

  return pretext;
};

const createFeedbackSubmittedTemplate = (user_name, feedback, isAnonymous) => {
  return [
    {
      mrkdwn_in: ["text", "fallback", "pretext"],
      fallback: createPretext(user_name, isAnonymous),
      color: COLOR,
      pretext: createPretext(user_name, isAnonymous),
      text: feedback
    }
  ];
};

module.exports = { createFeedbackSubmittedTemplate };
