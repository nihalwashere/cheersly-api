const ThisOrThatModel = require("../../../mongo/models/ThisOrThat");
const {
  ACTION_IDS: { THIS },
} = require("../../../global/constants");
const { updateChat, openModal } = require("../../api");
const {
  createThisOrThatResultsView,
  createResponseAlreadySubmittedView,
} = require("./template");
const logger = require("../../../global/logger");

const handleThisOrThatPlayed = async payload => {
  try {
    const {
      trigger_id,
      user: { id: userId },
      team: { id: teamId },
      channel: { id: channelId },
      actions,
    } = payload;

    const { action_id } = actions[0];

    const action = String(action_id).split("-")[0];

    const gameId = String(action_id).split("-")[1];

    const thisOrThat = await ThisOrThatModel.findOne({ gameId });

    if (thisOrThat) {
      const { question, blocks, votes, messageTimestamp } = thisOrThat;

      let thisVotes = [];
      let thatVotes = [];

      if (action === THIS) {
        thisVotes = [...votes.this];

        if (thisVotes.includes(userId)) {
          await openModal(
            teamId,
            trigger_id,
            createResponseAlreadySubmittedView()
          );
        } else {
          thisVotes.push(userId);
        }
      } else {
        thatVotes = [...votes.that];

        if (thatVotes.includes(userId)) {
          await openModal(
            teamId,
            trigger_id,
            createResponseAlreadySubmittedView()
          );
        } else {
          thatVotes.push(userId);
        }
      }

      let updatedVotes = {};

      if (action === THIS) {
        updatedVotes = { this: thisVotes, that: votes.that };
      } else {
        updatedVotes = { this: votes.this, that: thatVotes };
      }

      const resultBlocks = createThisOrThatResultsView(
        blocks,
        question,
        updatedVotes
      );

      await ThisOrThatModel.findOneAndUpdate(
        { gameId },
        {
          blocks: resultBlocks,
          votes: updatedVotes,
        }
      );

      await updateChat(teamId, channelId, messageTimestamp, blocks);
    }
  } catch (error) {
    logger.error("handleThisOrThatPlayed() -> error : ", error);
  }
};

module.exports = { handleThisOrThatPlayed };
