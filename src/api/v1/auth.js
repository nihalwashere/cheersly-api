const express = require("express");

const router = express.Router();

const { validateToken } = require("../../utils/common");
const logger = require("../../global/logger");

router.post("/validate-token", async (req, res) => {
  try {
    const { headers } = req;

    const payload = await validateToken(headers);

    return res.status(payload.status).json(payload);
  } catch (error) {
    logger.error("/validate-token failed -> ", error);
  }
});

module.exports = router;
