const express = require("express");

const router = express.Router();

const SubscriptionsModel = require("../../../mongo/models/Subscriptions");
const PointTopUpsModel = require("../../../mongo/models/PointTopUps");
const TeamPointBalanceModel = require("../../../mongo/models/TeamPointBalance");
const AuthModel = require("../../../mongo/models/Auth");
const {
  createSetupIntent,
  listPaymentMethods,
  createPaymentIntent,
  getPaymentIntent,
  getBalanceTransaction,
} = require("../../../stripe");
const { validateToken } = require("../../../utils/common");

const logger = require("../../../global/logger");

router.post("/create-setup-intent", async (req, res) => {
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

    const subscription = await SubscriptionsModel.findOne({ teamId });

    if (!subscription) {
      return res.status(400).json({
        success: false,
        message: "Subscription not found.",
      });
    }

    const { customerId } = subscription;

    const response = await createSetupIntent(customerId);

    return res.status(200).json({
      success: true,
      data: {
        clientSecret: response.client_secret,
      },
    });
  } catch (error) {
    logger.error("POST /billing/create-setup-intent -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

router.get("/payment-methods", async (req, res) => {
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

    const subscription = await SubscriptionsModel.findOne({ teamId });

    if (!subscription) {
      return res.status(400).json({
        success: false,
        message: "Subscription not found.",
      });
    }

    const { customerId } = subscription;

    const response = await listPaymentMethods(customerId);

    let data = { card: {} };

    if (
      response &&
      response.data &&
      response.data[0] &&
      response.data[0].card
    ) {
      data = {
        card: {
          brand: response.data[0].card.brand,
          expiryMonth: response.data[0].card.exp_month,
          expiryYear: response.data[0].card.exp_year,
          lastFourDigits: response.data[0].card.last4,
        },
      };
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("GET /billing/payment-methods -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

router.post("/payment-method", async (req, res) => {
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

    const { paymentMethodId } = req.body;

    if (!paymentMethodId) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required.",
      });
    }

    await SubscriptionsModel.findOneAndUpdate({ teamId }, { paymentMethodId });

    // payment method added, update getting started steps
    await AuthModel.findOneAndUpdate(
      { "slackInstallation.team.id": teamId },
      { paymentMethodAdded: true }
    );

    return res.status(200).json({
      success: true,
      message: "Payment method added successfully.",
    });
  } catch (error) {
    logger.error("POST /billing/payment-method -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

router.post("/create-payment-intent", async (req, res) => {
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

    const { points, pointCost, platformFee, totalCost } = req.body;

    if (!points) {
      return res.status(400).json({
        success: false,
        message: "Points is required.",
      });
    }

    if (!pointCost) {
      return res.status(400).json({
        success: false,
        message: "Point cost is required.",
      });
    }

    if (!platformFee) {
      return res.status(400).json({
        success: false,
        message: "Platform fee is required.",
      });
    }

    if (!totalCost) {
      return res.status(400).json({
        success: false,
        message: "Total cost is required.",
      });
    }

    const subscription = await SubscriptionsModel.findOne({ teamId });

    if (!subscription) {
      return res.status(400).json({
        success: false,
        message: "Subscription not found.",
      });
    }

    const { customerId, paymentMethodId } = subscription;

    const metadata = {
      points,
      pointCost,
      platformFee,
      totalCost,
      type: "POINTS_TOPUP",
    };

    const description = `Top-up of ${points} points`;

    const response = await createPaymentIntent({
      amount: parseFloat((totalCost * 100).toFixed(2)), // convert to cents
      customerId,
      paymentMethodId,
      metadata,
      description,
    });

    if (response && response.id) {
      const balanceTransaction = await getBalanceTransaction(
        response.charges.data[0].balance_transaction
      );

      await new PointTopUpsModel({
        teamId,
        points,
        pointCost,
        platformFee,
        totalCost,
        paymentIntentId: response.id,
        stripeFees: Number(balanceTransaction.fee / 100), // convert to dollars
        netAmount: Number(balanceTransaction.net / 100), // covert to dollars
      }).save();

      const { balance } = await TeamPointBalanceModel.findOne({ teamId });

      // update team's point balance
      await TeamPointBalanceModel.findOneAndUpdate(
        { teamId },
        { balance: Number(balance) + Number(points) }
      );
    }

    return res.status(200).json({
      success: true,
      message: `${points} points topped up successfully.`,
    });
  } catch (error) {
    logger.error("POST /billing/create-payment-intent -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

router.get("/get-payment-intent", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (!token.success) {
      return res.status(401).json(token);
    }

    const { paymentIntentId } = req.query;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: "Payment Intent ID is required.",
      });
    }

    const response = await getPaymentIntent(paymentIntentId);

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    logger.error("GET /billing/get-payment-intent -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

module.exports = router;
