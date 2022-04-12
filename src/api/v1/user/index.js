const express = require("express");

const router = express.Router();

const UserModel = require("../../../mongo/models/User");
const CheersStatsModel = require("../../../mongo/models/CheersStats");
const { validateToken } = require("../../../utils/common");
const logger = require("../../../global/logger");

router.get("/all", async (req, res) => {
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

    const { name = "" } = req.query;

    let filters = {
      "slackUserData.team_id": teamId,
    };

    if (name) {
      filters = {
        "slackUserData.profile.real_name": { $regex: name, $options: "i" },
      };
    }

    const users = await UserModel.find({
      ...filters,
    });

    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    logger.error("GET /user/all -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

router.get("/all/stats", async (req, res) => {
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

    let { pageIndex, pageSize } = req.query;

    pageIndex = Number(pageIndex);
    pageSize = Number(pageSize);

    const data = [];

    const totalCount = await UserModel.find({
      "slackUserData.team_id": teamId,
    }).countDocuments({});

    const users = await UserModel.find({ "slackUserData.team_id": teamId })
      .sort({ created_at: 1 })
      .skip(pageSize * pageIndex)
      .limit(pageSize);

    await Promise.all(
      users.map(async user => {
        const cheersStats = await CheersStatsModel.findOne({
          slackUserId: user.slackUserData.id,
        });

        const payload = {
          user,
        };

        if (cheersStats) {
          payload.cheersRedeemable = cheersStats.cheersRedeemable;
        }

        data.push(payload);
      })
    );

    return res.status(200).json({
      success: true,
      data,
      totalCount: Number(totalCount),
      totalPages: Math.ceil(totalCount / pageSize),
    });
  } catch (error) {
    logger.error("GET /user/all/stats -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

router.put("/country", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (!token.success) {
      return res.status(401).json(token);
    }

    const {
      data: {
        user: {
          slackUserData: { team_id: teamId, id: slackUserId },
        },
      },
    } = token;

    const { country = "" } = req.body;

    if (!country) {
      return res
        .status(400)
        .json({ success: false, message: "Country is required." });
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      {
        "slackUserData.team_id": teamId,
        "slackUserData.id": slackUserId,
      },
      {
        country,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: {
        user: {
          role: updatedUser.role,
          country: updatedUser.country,
          slackUserData: updatedUser.slackUserData,
        },
      },
    });
  } catch (error) {
    logger.error("PUT /user/country -> error : ", error);
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
          slackUserData: { id: slackUserId, team_id: teamId },
        },
      },
    } = token;

    const cheersStats = await CheersStatsModel.findOne({
      teamId,
      slackUserId,
    });

    return res.status(200).json({
      success: true,
      data: {
        balance: cheersStats.cheersRedeemable,
      },
    });
  } catch (error) {
    logger.error("GET /user/balance -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

module.exports = router;
