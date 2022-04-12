const express = require("express");

const router = express.Router();

const AuthModel = require("../../../mongo/models/Auth");
const RecognitionTeamsModel = require("../../../mongo/models/RecognitionTeams");
const CompanyValuesModel = require("../../../mongo/models/CompanyValues");
const {
  getConversationMembers,
} = require("../../../slack/pagination/conversations-members");
const { validateToken } = require("../../../utils/common");
const logger = require("../../../global/logger");

// RECOGNITION TEAMS

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

    const teams = await RecognitionTeamsModel.find({ teamId });

    return res.status(200).json({ success: true, data: teams });
  } catch (error) {
    logger.error("GET /recognition/teams -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

router.get("/teams/:id", async (req, res) => {
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

    const team = await RecognitionTeamsModel.findOne({
      _id: id,
      teamId,
    }).populate("members managers");

    if (!team) {
      return res
        .status(400)
        .json({ success: false, message: "Team not found." });
    }

    return res.status(200).json({ success: true, data: team });
  } catch (error) {
    logger.error("GET /recognition/teams/:id -> error : ", error);
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

    const { name = "" } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required." });
    }

    await new RecognitionTeamsModel({
      teamId,
      name,
    }).save();

    const recognitionTeamsCount = await RecognitionTeamsModel.find({
      teamId,
    }).countDocuments({});

    if (recognitionTeamsCount === 1) {
      // first recognition team created, update getting started steps
      await AuthModel.findOneAndUpdate(
        { "slackInstallation.team.id": teamId },
        { recognitionTeamCreated: true }
      );
    }

    return res
      .status(200)
      .json({ success: true, message: "Team created successfully." });
  } catch (error) {
    logger.error("POST /recognition/teams -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

router.put("/teams/:id", async (req, res) => {
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
      name = "",
      channel = {},
      pointAllowance = "",
      pointAmountOptions = [],
      managers = [],
    } = req.body;

    const { id } = req.params;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required." });
    }

    if (!channel.id) {
      return res
        .status(400)
        .json({ success: false, message: "Channel is required." });
    }

    if (!pointAllowance) {
      return res
        .status(400)
        .json({ success: false, message: "Point allowance is required." });
    }

    if (!pointAmountOptions.length) {
      return res
        .status(400)
        .json({ success: false, message: "Point amount options is required." });
    }

    if (!managers.length) {
      return res
        .status(400)
        .json({ success: false, message: "Atleast one manager is required." });
    }

    const oldRecognitionTeam = await RecognitionTeamsModel.findOne({
      _id: id,
      teamId,
    });

    await RecognitionTeamsModel.findOneAndUpdate(
      { _id: id, teamId },
      {
        name,
        channel,
        pointAllowance,
        pointAmountOptions,
        managers,
      }
    );

    if (channel.id && channel.id !== oldRecognitionTeam.channel.id) {
      await getConversationMembers(teamId, id, channel.id);
    }

    return res
      .status(200)
      .json({ success: true, message: "Team updated successfully." });
  } catch (error) {
    logger.error("PUT /recognition/teams/:id -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

router.delete("/teams/:id", async (req, res) => {
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

    await RecognitionTeamsModel.findOneAndDelete({ _id: id, teamId });

    return res
      .status(200)
      .json({ success: true, message: "Team deleted successfully." });
  } catch (error) {
    logger.error("DELETE /recognition/teams/:id -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

// COMPANY VALUES

router.get("/company-values", async (req, res) => {
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

    const companyValues = await CompanyValuesModel.find({
      teamId,
    });

    return res.status(200).json({ success: true, data: companyValues });
  } catch (error) {
    logger.error("GET /recognition/company-values -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

router.post("/company-values", async (req, res) => {
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

    const { title = "", description = "" } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required." });
    }

    if (!description) {
      return res
        .status(400)
        .json({ success: false, message: "Description is required." });
    }

    await new CompanyValuesModel({
      teamId,
      title,
      description,
    }).save();

    const companyValuesCount = await CompanyValuesModel.find({
      teamId,
    }).countDocuments({});

    if (companyValuesCount === 1) {
      // first company value created, update getting started steps
      await AuthModel.findOneAndUpdate(
        { "slackInstallation.team.id": teamId },
        { companyValuesCreated: true }
      );
    }

    return res
      .status(200)
      .json({ success: true, message: "Company value created successfully." });
  } catch (error) {
    logger.error("POST /recognition/company-values -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

router.put("/company-values/:id", async (req, res) => {
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

    const { title = "", description = "" } = req.body;

    const { id } = req.params;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required." });
    }

    if (!description) {
      return res
        .status(400)
        .json({ success: false, message: "Description is required." });
    }

    await CompanyValuesModel.findOneAndUpdate(
      {
        _id: id,
        teamId,
      },
      {
        title,
        description,
      }
    );

    return res
      .status(200)
      .json({ success: true, message: "Company value updated successfully." });
  } catch (error) {
    logger.error("PUT /recognition/company-values -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

router.delete("/company-values/:id", async (req, res) => {
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

    await CompanyValuesModel.findOneAndDelete({
      _id: id,
      teamId,
    });

    return res
      .status(200)
      .json({ success: true, message: "Company value deleted successfully." });
  } catch (error) {
    logger.error("DELETE /recognition/company-values -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

module.exports = router;
