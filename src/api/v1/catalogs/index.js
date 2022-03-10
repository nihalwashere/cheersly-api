const express = require("express");

const router = express.Router();

const { getCatalogs } = require("../../../tango-card/api");
const { validateToken } = require("../../../utils/common");
const logger = require("../../../global/logger");

// CATALOGS

router.get("/", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (!token.success) {
      return res.status(401).json(token);
    }

    // const {
    //   data: {
    //     user: {
    //       slackUserData: { team_id: teamId },
    //     },
    //   },
    // } = token;

    const { brandKey = null } = req.query;

    let filters = "";

    if (brandKey) {
      filters = `?brandKey=${brandKey}`;
    }

    const catalogs = await getCatalogs(filters);

    return res.status(200).json({ success: true, data: catalogs });
  } catch (error) {
    logger.error("GET /catalogs -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

module.exports = router;
