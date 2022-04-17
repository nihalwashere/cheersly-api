const express = require("express");
const { spawn } = require("child_process");

const router = express.Router();

const { handleCheersCommand } = require("../../slack/commands/cheers");
const { paginateUsersList } = require("../../slack/pagination/users-list");
const { publishAppHome } = require("../../slack/app-home");
const { createCustomer } = require("../../stripe");
const logger = require("../../global/logger");

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

router.post("/app-home", async (req, res) => {
  const { teamId, slackUserId } = req.body;
  await publishAppHome(teamId, slackUserId);
  res.status(200).json({ success: true });
});

router.post("/cron-all-time", async (req, res) => {
  spawn(process.execPath, ["./src/cron/stats/all-time.js"], {
    stdio: "inherit",
  });

  return res.status(200).json({ success: true });
});

router.post("/cron-weekly", async (req, res) => {
  spawn(process.execPath, ["./src/cron/stats/weekly.js"], {
    stdio: "inherit",
  });

  return res.status(200).json({ success: true });
});

router.post("/cron-monthly", async (req, res) => {
  spawn(process.execPath, ["./src/cron/stats/monthly.js"], {
    stdio: "inherit",
  });

  return res.status(200).json({ success: true });
});

router.post("/cron-cheers", async (req, res) => {
  spawn(process.execPath, ["./src/cron/say-cheers/index.js"], {
    stdio: "inherit",
  });

  return res.status(200).json({ success: true });
});

router.post("/cron-upgrade-trial-subscription", async (req, res) => {
  spawn(process.execPath, ["./src/cron/upgrade-trial-subscription/index.js"], {
    stdio: "inherit",
  });

  return res.status(200).json({ success: true });
});

router.post("/create-customer", async (req, res) => {
  try {
    const customer = await createCustomer("LoneWolf-Dev");

    logger.debug("customer : ", customer);

    return res.sendStatus(200);
  } catch (error) {
    logger.error("error -> ", error);
  }
});

module.exports = router;
