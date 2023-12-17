const responseUtil = require('../utils/responseUtils');

const fundCreationValidator = (req, res, next) => {
  const { fundName, balance, fundType, currency } = req.body;

  if (!fundName || Object.keys(fundName).length === 0) {
    return res.json(responseUtil.createErrorResponse("Fund must have a name"));
  } else if (!fundType || Object.keys(fundType).length === 0) {
    return res.json(responseUtil.createErrorResponse("Fund must have a fundType"));
  } else if (!currency || Object.keys(currency).length === 0) {
    return res.json(responseUtil.createErrorResponse("Fund must have a currency"));
  }

  // Set default value for balance if it's missing
  if (!balance) {
      req.body.balance = 0;
  }

  next();
};

module.exports = fundCreationValidator;