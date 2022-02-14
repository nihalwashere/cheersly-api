const express = require("express");

const router = express.Router();

const { validateToken } = require("../../../../utils/common");
const { conversationsList } = require("../../../../slack/api");
const logger = require("../../../../global/logger");

// CHANNELS

router.get("/", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (!token.success) {
      return res.status(401).json(token);
    }

    const {
      data: {
        user: {
          slackUserData: { team_id: teamId },
        },
      },
    } = token;

    const conversations = await conversationsList(teamId);

    if (!conversations.ok) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to fetch conversations." });
    }

    return res
      .status(200)
      .json({ success: true, data: conversations.channels });
  } catch (error) {
    logger.error("GET /channels/ -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

module.exports = router;
