const createCheersSubmittedTemplate = ({
  senderUserId,
  recipients,
  reason,
  giphyUrl,
  companyValues,
  points,
}) => {
  let recipientString = "";

  recipients.map((recipient, index) => {
    recipientString += `<@${recipient}>${
      recipients.length === index + 1 ? "" : ", "
    }`;
  });

  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<@${senderUserId}> shared some cheers for \`${points} points\` with ${recipientString}.`,
      },
    },
  ];

  if (reason) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*For reason:*\n_${reason}_`,
      },
    });
  }

  let companyValuesString = "";

  companyValues.map(companyValue => {
    companyValuesString += `\`${companyValue}\` `;
  });

  if (companyValues && companyValues.length) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Company values favored :*\n${companyValuesString}`,
      },
    });
  }

  if (giphyUrl) {
    blocks.push({
      type: "image",
      image_url: giphyUrl,
      alt_text: "cheers",
    });
  }

  return blocks;
};

module.exports = {
  createCheersSubmittedTemplate,
};
