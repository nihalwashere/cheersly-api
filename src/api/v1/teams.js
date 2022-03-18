const express = require("express");

const router = express.Router();

const AuthModel = require("../../mongo/models/Auth");
const ActivityModel = require("../../mongo/models/Activity");
const SettingsModel = require("../../mongo/models/Settings");
const { validateToken } = require("../../utils/common");
const logger = require("../../global/logger");

// TEAM

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

    const auth = await AuthModel.findOne({ teamId });

    return res.status(200).json({ success: true, data: auth });
  } catch (error) {
    logger.error("GET /teams -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

// ACTIVITY

router.get("/activity", async (req, res) => {
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

    const { pageSize, pageIndex } = req.params;

    const totalCount = await ActivityModel.find({
      teamId,
    }).countDocuments({});

    const activity = await ActivityModel.find({ teamId })
      .sort({ created_at: 1 })
      .skip(pageSize * pageIndex)
      .limit(pageSize);

    return res.status(200).json({
      success: true,
      activity,
      totalCount: Number(totalCount),
      totalPages: Math.ceil(totalCount / pageSize),
    });
  } catch (error) {
    logger.error("GET /teams/activity -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

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
