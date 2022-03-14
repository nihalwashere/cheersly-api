const express = require("express");

const router = express.Router();

const SettingsModel = require("../../../mongo/models/Settings");
const { validateToken } = require("../../../utils/common");
const logger = require("../../../global/logger");

// SETTINGS

router.get("/settings", async (req, res) => {
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

    const settings = await SettingsModel.findOne({ teamId }).populate("admins");

    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    logger.error("GET /teams/settings -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

router.put("/settings", async (req, res) => {
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

    const {
      isActivated,
      admins,
      allowanceReloaded,
      pointsAboutToExpire,
      inactivityReminders,
      pointsAvailableToRedeem,
    } = req.body;

    if (!admins.length) {
      return res
        .status(400)
        .json({ success: false, message: "Atleast one admin is required." });
    }

    await SettingsModel.findOneAndUpdate(
      { teamId },
      {
        isActivated,
        admins,
        allowanceReloaded,
        pointsAboutToExpire,
        inactivityReminders,
        pointsAvailableToRedeem,
      }
    );

    return res
      .status(200)
      .json({ success: true, message: "Settings updated successfully." });
  } catch (error) {
    logger.error("GET /teams/settings -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

module.exports = router;
