const createRedemptionRequestSettledTemplate = ({ title, price }) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "Hurray! Your redemption request has been settled :money_mouth_face:",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:relieved: *Reward*  : ${title}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:moneybag: *Price* : ${price}`,
      },
    },
  ];
};

const createRedemptionRequestDeclinedTemplate = ({ title, price }) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Your redemption request has been declined :sweat_smile:",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:relieved: *Reward*  : ${title}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:moneybag: *Price* : ${price}`,
      },
    },
  ];
};

module.exports = {
  createRedemptionRequestSettledTemplate,
  createRedemptionRequestDeclinedTemplate,
};
