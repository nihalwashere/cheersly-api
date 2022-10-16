const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const logger = require("../global/logger");

const createCustomer = async (name, email) => {
  try {
    return await stripe.customers.create({
      name,
      email,
    });
  } catch (error) {
    logger.error("createCustomer() -> error : ", error);
  }
};

const createSetupIntent = async customerId => {
  try {
    return await stripe.setupIntents.create({
      customer: customerId,
    });
  } catch (error) {
    logger.error("createSetupIntent() -> error : ", error);
  }
};

const listPaymentMethods = async customerId => {
  try {
    return await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });
  } catch (error) {
    logger.error("listPaymentMethods() -> error : ", error);
  }
};

const createPaymentIntent = async ({
  amount,
  customerId,
  paymentMethodId,
  metadata,
  description,
}) => {
  try {
    return await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      customer: customerId,
      payment_method: paymentMethodId,
      metadata,
      description,
      off_session: true,
      confirm: true,
    });
  } catch (error) {
    logger.debug("createPaymentIntent() -> error : ", error);

    const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(
      error.raw.payment_intent.id
    );

    logger.debug("PI retrieved ID -> ", paymentIntentRetrieved.id);
  }
};

const getPaymentIntent = async paymentIntentId => {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    logger.debug("getPaymentIntent() -> error : ", error);
  }
};

const listCards = async customerId => {
  try {
    return await stripe.customers.listSources(customerId, {
      object: "card",
    });
  } catch (error) {
    logger.error("listCards() -> error : ", error);
  }
};

const getBalanceTransaction = async transactionId => {
  try {
    return await stripe.balanceTransactions.retrieve(transactionId);
  } catch (error) {
    logger.error("getBalanceTransaction() -> error : ", error);
  }
};

module.exports = {
  createCustomer,
  createSetupIntent,
  listPaymentMethods,
  createPaymentIntent,
  getPaymentIntent,
  listCards,
  getBalanceTransaction,
};
