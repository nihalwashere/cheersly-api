const express = require("express");
const moment = require("moment-timezone");

const router = express.Router();

const AuthModel = require("../../../mongo/models/Auth");
const ActivityModel = require("../../../mongo/models/Activity");
const SettingsModel = require("../../../mongo/models/Settings");
const OrdersModel = require("../../../mongo/models/Orders");
const TeamPointBalanceModel = require("../../../mongo/models/TeamPointBalance");
const PointTopUpsModel = require("../../../mongo/models/PointTopUps");
const {
  sendOnBoardingInstructionsToAllUsers,
} = require("../../../concerns/onboarding");
const { validateToken } = require("../../../utils/common");
const logger = require("../../../global/logger");

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

    const auth = await AuthModel.findOne({
      "slackInstallation.team.id": teamId,
    });

    return res.status(200).json({ success: true, data: auth });
  } catch (error) {
    logger.error("GET /team -> error : ", error);
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
    logger.error("GET /team/activity -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

// ENABLE APP

router.post("/enable-app", async (req, res) => {
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
      shouldSendOnboardingMessage,
      shouldAddCustomMessage,
      message = "",
    } = req.body;

    if (shouldSendOnboardingMessage && shouldAddCustomMessage && !message) {
      return res
        .status(400)
        .json({ success: false, message: "Custom message is required." });
    }

    // update app launched for getting started steps
    await AuthModel.findOneAndUpdate(
      {
        "slackInstallation.team.id": teamId,
      },
      { appLaunched: true }
    );

    if (shouldSendOnboardingMessage) {
      await AuthModel.findOneAndUpdate(
        {
          "slackInstallation.team.id": teamId,
        },
        { appIntroducedToTeam: true }
      );

      await sendOnBoardingInstructionsToAllUsers(teamId, message);
    }

    return res.status(200).json({
      success: true,
      message: "Hurray, Cheersly is now enabled for your team to use!",
    });
  } catch (error) {
    logger.error("GET /team/enable-app -> error : ", error);
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
    logger.error("GET /team/settings -> error : ", error);
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
      requireCompanyValues,
      enableSharingGiphys,
      enableGiftCards,
    } = req.body;

    if (!admins.length) {
      return res
        .status(400)
        .json({ success: false, message: "Atleast one admin is required." });
    }

    if (enableGiftCards) {
      // reward redemptions enabled, update getting started steps
      await AuthModel.findOneAndUpdate(
        { "slackInstallation.team.id": teamId },
        { rewardRedemptionsEnabled: true }
      );
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
        requireCompanyValues,
        enableSharingGiphys,
        enableGiftCards,
      }
    );

    return res
      .status(200)
      .json({ success: true, message: "Settings updated successfully." });
  } catch (error) {
    logger.error("GET /team/settings -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

router.get("/balance", async (req, res) => {
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

    const teamPointBalance = await TeamPointBalanceModel.findOne({ teamId });

    return res.status(200).json({
      success: true,
      data: {
        balance: teamPointBalance.balance,
      },
    });
  } catch (error) {
    logger.error("GET /team/balance -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

router.get("/reward-stats", async (req, res) => {
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

    const teamPointBalance = await TeamPointBalanceModel.findOne({ teamId });

    const orders = await OrdersModel.find({
      teamId,
      "response.status": "COMPLETE",
      createdAt: {
        $gte: moment()
          .startOf("month")
          .toDate(),
        $lte: new Date(),
      },
    });

    let redemptionPoints = 0;
    let redemptionCosts = 0;

    orders.forEach(order => {
      redemptionPoints += Number(order.points);
      redemptionCosts += Number(order.response.amountCharged.total);
    });

    return res.status(200).json({
      success: true,
      data: {
        purchasedPoints: teamPointBalance.balance,
        redemptionPoints,
        redemptionCosts,
      },
    });
  } catch (error) {
    logger.error("GET /team/reward-stats -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

router.get("/top-ups", async (req, res) => {
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

    const data = await PointTopUpsModel.find({ teamId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("GET /team/top-ups -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

module.exports = router;
