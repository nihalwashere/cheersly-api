const {
  BLOCK_IDS: { TWO_TRUTHS_GUESS_STATEMENT },
  ACTION_IDS: {
    TWO_TRUTHS_GUESS_STATEMENT_ONE,
    TWO_TRUTHS_GUESS_STATEMENT_TWO,
    TWO_TRUTHS_GUESS_STATEMENT_THREE,
  },
} = require("../../../global/constants");

const createStatementBlocks = statements =>
  statements.map((statement, index) => ({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*Statement ${index + 1}: *${statement.value}`,
    },
  }));

const createTwoTruthsAndALieSubmittedTemplate = ({
  userId,
  gameId,
  statements,
}) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<@${userId}> has invited you to play *Two truths and a lie* :lying_face:`,
      },
    },
    ...createStatementBlocks(statements),
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Can you guess the lie?",
      },
    },
    {
      type: "actions",
      block_id: TWO_TRUTHS_GUESS_STATEMENT,
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Statement 1",
            emoji: true,
          },
          value: statements[0].id,
          action_id: `${gameId}-${TWO_TRUTHS_GUESS_STATEMENT_ONE}`,
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Statement 2",
            emoji: true,
          },
          value: statements[1].id,
          action_id: `${gameId}-${TWO_TRUTHS_GUESS_STATEMENT_TWO}`,
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Statement 3",
            emoji: true,
          },
          value: statements[2].id,
          action_id: `${gameId}-${TWO_TRUTHS_GUESS_STATEMENT_THREE}`,
        },
      ],
    },
  ];
};

module.exports = { createTwoTruthsAndALieSubmittedTemplate };
