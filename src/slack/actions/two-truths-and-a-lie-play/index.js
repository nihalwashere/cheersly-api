const TwoTruthsAndALieModel = require("../../../mongo/models/TwoTruthsAndALie");
const {
  ACTION_IDS: {
    TWO_TRUTHS_STATEMENT_ONE,
    TWO_TRUTHS_STATEMENT_TWO,
    TWO_TRUTHS_STATEMENT_THREE,
  },
} = require("../../../global/constants");
const { updateChat, openModal } = require("../../api");
const {
  createTwoTruthsAndALieResultsView,
  createResponseAlreadySubmittedView,
  createCorrectResponseView,
  createWrongResponseView,
} = require("./template");
const logger = require("../../../global/logger");

const getStatementNumber = action => {
  if (action === TWO_TRUTHS_STATEMENT_ONE) {
    return 1;
  }

  if (action === TWO_TRUTHS_STATEMENT_TWO) {
    return 2;
  }

  if (action === TWO_TRUTHS_STATEMENT_THREE) {
    return 3;
  }
};

const handleTwoTruthsAndALiePlayed = async payload => {
  try {
    const {
      trigger_id,
      user: { id: userId },
      team: { id: teamId },
      channel: { id: channelId },
      actions,
    } = payload;

    const { action_id, value: selectedStatementId } = actions[0];

    const gameId = String(action_id).split("-")[0];

    const action = String(action_id).split("-")[1];

    const twoTruthsAndALie = await TwoTruthsAndALieModel.findOne({ gameId });

    if (twoTruthsAndALie) {
      const { blocks, votes, messageTimestamp, lie } = twoTruthsAndALie;

      const voters = [...votes.correct, ...votes.wrong];

      if (voters.includes(userId)) {
        return await openModal(
          teamId,
          trigger_id,
          createResponseAlreadySubmittedView({
            number: getStatementNumber(action),
            lie: lie.value,
          })
        );
      }

      let isCorrect = false;
      const correctVotes = [...votes.correct];
      const wrongVotes = [...votes.wrong];

      if (selectedStatementId === lie.id) {
        correctVotes.push(userId);
        isCorrect = true;
      } else {
        wrongVotes.push(userId);
      }

      const resultBlocks = createTwoTruthsAndALieResultsView({
        blocks,
        correctVotes,
        wrongVotes,
      });

      await TwoTruthsAndALieModel.findOneAndUpdate(
        { gameId },
        {
          blocks: resultBlocks,
          votes: {
            correct: correctVotes,
            wrong: wrongVotes,
          },
        }
      );

      await updateChat(teamId, channelId, messageTimestamp, resultBlocks);

      if (isCorrect) {
        return await openModal(
          teamId,
          trigger_id,
          createCorrectResponseView({
            number: getStatementNumber(action),
            lie: lie.value,
          })
        );
      }

      return await openModal(
        teamId,
        trigger_id,
        createWrongResponseView({
          number: getStatementNumber(action),
          lie: lie.value,
        })
      );
    }
  } catch (error) {
    logger.error("handleTwoTruthsAndALiePlayed() -> error : ", error);
  }
};

module.exports = { handleTwoTruthsAndALiePlayed };
