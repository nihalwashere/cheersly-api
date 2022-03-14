const { getAppUrl } = require("../../../utils/common");

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

const createCheersNewsInDMTemplate = (
  permaLink,
  points,
  senderUserId,
  channelId
) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `<@${senderUserId}> shared some <${permaLink}|cheers> with you for \`${points} points\` in <#${channelId}>!`,
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "You now have `-- points` to redeem.",
    },
    accessory: {
      type: "button",
      text: {
        type: "plain_text",
        text: ":moneybag: Redeem your points",
        emoji: true,
      },
      url: `${getAppUrl()}/redeem`,
    },
  },
];

module.exports = {
  createCheersSubmittedTemplate,
  createCheersNewsInDMTemplate,
};
