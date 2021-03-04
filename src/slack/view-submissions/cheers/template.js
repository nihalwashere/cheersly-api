const createCheersSubmittedTemplate = (users, description) => {
  const blocks = [];

  const n = 5;

  const result = new Array(Math.ceil(users.length / n))
    .fill()
    .map(() => users.splice(0, n));

  for (let i = 0; i < result.length; i++) {
    const userArr = result[i];

    let wrappedText = "";

    for (let j = 0; j < userArr.length; j++) {
      const user = userArr[j];

      const message = `@${user.recipient} now has ${user.cheersReceived} cheers :beers:`;

      wrappedText += message + "\n";
    }

    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: wrappedText
      }
    });
  }

  if (description) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `_*${description}*_`
      }
    });
  }

  return blocks;
};

module.exports = {
  createCheersSubmittedTemplate
};
