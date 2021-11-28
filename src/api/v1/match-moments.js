const express = require("express");
const MatchMomentsModel = require("../../mongo/models/MatchMoments");
const logger = require("../../global/logger");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { teamId } = req.body;

    const matchMoments = await MatchMomentsModel.find({ teamId });

    return res.json({ data: matchMoments, success: true }).status(200);
  } catch (error) {
    logger.error("GET /match-moments -> error : ", error);
  }
});

router.post("/", async (req, res) => {
  try {
    const { teamId, day, time, timezone } = req.body;

    const matchMoment = await new MatchMomentsModel({
      teamId,
      day,
      time,
      timezone
    }).save();

    return res.json({ data: matchMoment, success: true }).status(200);
  } catch (error) {
    logger.error("POST /match-moments -> error : ", error);
  }
});

module.exports = router;
