const express = require("express");

const router = express.Router();

const logger = require("../../global/logger");

router.get("/health", (req, res) =>
  res.json({ msg: "Test routes are up and running!!!" })
);

module.exports = router;
