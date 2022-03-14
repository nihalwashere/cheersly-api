const express = require("express");

const router = express.Router();

const UserModel = require("../../../mongo/models/User");
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
    logger.error("GET /users/all -> error : ", error);
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
    logger.error("PUT /users/country -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

module.exports = router;
