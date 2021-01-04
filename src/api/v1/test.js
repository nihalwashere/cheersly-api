const express = require("express");

const router = express.Router();

const { handleCheersCommand } = require("../../slack/commands/cheers");
const { paginateUsersList } = require("../../slack/pagination/users-list");
// const logger = require("../../global/logger");

router.get("/health", (req, res) =>
  res.json({ msg: "Test routes are up and running!!!" })
);

router.post("/users-list", async (req, res) => {
  const { token } = req.body;
  await paginateUsersList(token);
  res.status(200).json({ success: true });
});

router.post("/cheers", async (req, res) => {
  const { teamId, channelId, senderUsername, text } = req.body;
  await handleCheersCommand(teamId, channelId, senderUsername, text);
  res.status(200).json({ success: true });
});

module.exports = router;
