const TwoTruthsAndALieModel = require("../../../mongo/models/TwoTruthsAndALie");
const { updateChat, openModal } = require("../../api");
const {
  createTwoTruthsAndALieResultsView,
  createResponseAlreadySubmittedView,
  createCorrectResponseView,
  createWrongResponseView,
} = require("./template");
const logger = require("../../../global/logger");

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

    const twoTruthsAndALie = await TwoTruthsAndALieModel.findOne({ gameId });

    if (twoTruthsAndALie) {
      const { blocks, votes, messageTimestamp, lie } = twoTruthsAndALie;

      const voters = [...votes.correct, ...votes.wrong];

      if (voters.includes(userId)) {
        return await openModal(
          teamId,
          trigger_id,
          createResponseAlreadySubmittedView({
            number: lie.number,
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
            number: lie.number,
            lie: lie.value,
          })
        );
      }

      return await openModal(
        teamId,
        trigger_id,
        createWrongResponseView({
          number: lie.number,
          lie: lie.value,
        })
      );
    }
  } catch (error) {
    logger.error("handleTwoTruthsAndALiePlayed() -> error : ", error);
  }
};

module.exports = { handleTwoTruthsAndALiePlayed };
