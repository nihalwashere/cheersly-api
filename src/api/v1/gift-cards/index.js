const express = require("express");

const router = express.Router();

const TeamPointBalanceModel = require("../../../mongo/models/TeamPointBalance");
const CheersStatsModel = require("../../../mongo/models/CheersStats");
const OrdersModel = require("../../../mongo/models/Orders");
const { getCatalogs, placeOrder } = require("../../../tango-card/api");
const { validateToken } = require("../../../utils/common");
const {
  TANGO_CARD_CUSTOMER_ID,
  TANGO_CARD_ACCOUNT_ID,
} = require("../../../global/config");
const logger = require("../../../global/logger");

// CATALOGS

router.get("/catalog", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (!token.success) {
      return res.status(401).json(token);
    }

    const { brandKey = null, country = null } = req.query;

    if (!country) {
      return res.status(400).json({
        success: false,
        message: "Country is required.",
      });
    }

    let filters = "";

    if (brandKey) {
      filters = `?brandKey=${brandKey}`;
    }

    if (country) {
      filters = `?country=${country}`;
    }

    const catalogs = await getCatalogs(filters);

    return res.status(200).json({ success: true, data: catalogs });
  } catch (error) {
    logger.error("GET /gift-cards/catalog -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

// PLACE ORDER

router.post("/order", async (req, res) => {
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

    const {
      points,
      amount,
      recipient: { email, firstName },
      utid,
    } = req.body;

    if (!points) {
      return res
        .status(400)
        .json({ success: false, message: "Points is required." });
    }

    if (!amount) {
      return res
        .status(400)
        .json({ success: false, message: "Amount is required." });
    }

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Recipient email is required." });
    }

    if (!firstName) {
      return res
        .status(400)
        .json({ success: false, message: "Recipient first name is required." });
    }

    if (!utid) {
      return res
        .status(400)
        .json({ success: false, message: "UTID is required." });
    }

    // check team point balance

    const teamPointBalance = await TeamPointBalanceModel.findOne({ teamId });

    if (
      !teamPointBalance ||
      (teamPointBalance && teamPointBalance.balance < points)
    ) {
      return res.status(400).json({
        success: false,
        message: `Oops! Your team does not have sufficient points balance.`,
      });
    }

    // check user point balance

    const cheersStats = await CheersStatsModel.findOne({ teamId, slackUserId });

    if (
      !cheersStats ||
      (cheersStats && cheersStats.cheersRedeemable < points)
    ) {
      return res.status(400).json({
        success: false,
        message: `Oops! You do not have sufficient points balance.`,
      });
    }

    // deduct team point balance
    const { balance } = teamPointBalance;

    const newTeamPointBalance = Number(balance - points);

    await TeamPointBalanceModel.findOneAndUpdate(
      { teamId },
      { balance: newTeamPointBalance }
    );

    // deduct user point balance
    const { cheersRedeemable } = cheersStats;

    const newCheersRedeemable = Number(cheersRedeemable - points);

    await CheersStatsModel.findOneAndUpdate(
      { teamId, slackUserId },
      { cheersRedeemable: newCheersRedeemable }
    );

    const payload = {
      accountIdentifier: TANGO_CARD_ACCOUNT_ID,
      customerIdentifier: TANGO_CARD_CUSTOMER_ID,
      amount,
      recipient: {
        email,
        firstName,
      },
      sendEmail: true,
      //   sender: {
      //     email: "",
      //     firstName: "",
      //     lastName: "",
      //   },
      utid,
      //   campaign: "",
      //   emailSubject: "",
      //   externalRefID: "",
      //   message: "",
      //   notes: "",
    };

    const { status, response } = await placeOrder(payload);

    logger.debug("status : ", status);

    logger.debug("response : ", response);

    await new OrdersModel({
      request: payload,
      response,
      teamId,
      slackUserId,
    }).save();

    let responsePayload = {
      success: null,
      message: "",
    };

    if (status === 201) {
      responsePayload = {
        success: true,
        message: "Gift card order placed successfully!",
      };
    } else {
      responsePayload = {
        success: false,
        message:
          "Oops, something went wrong. Please contact support@cheersly.club.",
      };
    }

    return res.status(200).json(responsePayload);
  } catch (error) {
    logger.error("POST /gift-cards/order -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

module.exports = router;
