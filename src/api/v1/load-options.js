const express = require("express");
const logger = require("../../global/logger");
const {
  SLACK_ACTIONS: { BLOCK_SUGGESTION }
} = require("../../global/constants");
const {
  blockSuggestionsHandler
} = require("../../slack/block-suggestions/handler");

const router = express.Router();

// SLACK LOAD OPTIONS FOR SELECT

router.get("/health", (req, res) =>
  res.json({ msg: "Load Options are up and running!!!" })
);

router.post("/", async (req, res) => {
  try {
    const { payload } = req.body;

    const parsedPayload = JSON.parse(payload);

    const { type } = parsedPayload;

    if (type === BLOCK_SUGGESTION) {
      const response = await blockSuggestionsHandler(parsedPayload);

      return res.status(200).send(response);
    }
  } catch (error) {
    logger.error("load-options -> error : ", error);
  }
});

module.exports = router;
