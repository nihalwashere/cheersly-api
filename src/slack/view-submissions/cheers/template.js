const createCheersSubmittedTemplate = ({
  senderUserId,
  recipients,
  reason,
  giphyUrl,
  companyValues,
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
        text: `<@${senderUserId}> just shared in some cheers with ${recipientString}, giving them \`10 points\` each.`,
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

  companyValuesString += companyValues.map((companyValue, index) => {
    companyValuesString += `\`${companyValue}>\`${
      companyValues.length === index + 1 ? "" : ", "
    }`;
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
