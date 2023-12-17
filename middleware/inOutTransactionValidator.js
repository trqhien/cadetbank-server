const responseUtil = require('../utils/responseUtils');

const inOutTransactionValidator = (req, res, next) => {
  const { sourceFundId, amount } = req.body;

  if (!sourceFundId || Object.keys(sourceFundId).length === 0) {
    return res.json(responseUtil.createErrorResponse("Transaction must have source fund"));
  }

  // Set default value for balance if it's missing
  if (!amount || amount <= 0) {
    return res.json(responseUtil.createErrorResponse("Transaction amount must be greater than 0"));
  }

  next();
};

module.exports = inOutTransactionValidator;