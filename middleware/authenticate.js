const jwt = require('jsonwebtoken');
const responseUtil = require('../utils/responseUtils');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.json(responseUtil.createErrorResponse("Authentication failed")); 
  }

  try {
    const decoded = jwt.verify(token, 'secretKey');
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.json(responseUtil.tokenExpired()); 
    } else {
      return res.json(responseUtil.createErrorResponse("Authentication failed")); 
    }
  }
};
