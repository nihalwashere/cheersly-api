const express = require("express");

const router = express.Router();

const UserModel = require("../../../mongo/models/User");
const TeamsModel = require("../../../mongo/models/Teams");
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

// TEAMS

router.get("/teams", async (req, res) => {
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

    const teams = await TeamsModel.find({ teamId });

    return res.status(200).json({ success: true, data: teams });
  } catch (error) {
    logger.error("GET /users/teams -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

router.post("/teams", async (req, res) => {
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

    const { name = "", members = [], managers = [] } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required." });
    }

    if (!members.length) {
      return res
        .status(400)
        .json({ success: false, message: "Members is required." });
    }

    if (!managers.length) {
      return res
        .status(400)
        .json({ success: false, message: "Managers is required." });
    }

    await new TeamsModel({
      teamId,
      name,
      members,
      managers,
    }).save();

    return res
      .status(200)
      .json({ success: true, message: "Team created successfully." });
  } catch (error) {
    logger.error("POST /users/teams -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

router.put("/teams", async (req, res) => {
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

    const { name = "", members = [], managers = [] } = req.body;

    const { id } = req.params;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required." });
    }

    if (!members.length) {
      return res
        .status(400)
        .json({ success: false, message: "Members is required." });
    }

    if (!managers.length) {
      return res
        .status(400)
        .json({ success: false, message: "Managers is required." });
    }

    await TeamsModel.findOneAndUpdate(
      { _id: id, teamId },
      {
        name,
        members,
        managers,
      }
    );

    return res
      .status(200)
      .json({ success: true, message: "Team updated successfully." });
  } catch (error) {
    logger.error("PUT /users/teams -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

router.delete("/teams", async (req, res) => {
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

    const { id } = req.params;

    await TeamsModel.findOneAndDelete({ _id: id, teamId });

    return res
      .status(200)
      .json({ success: true, message: "Team deleted successfully." });
  } catch (error) {
    logger.error("DELETE /users/teams -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

module.exports = router;
