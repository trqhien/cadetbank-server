const jwt = require('jsonwebtoken');
const responseUtil = require('../utils/responseUtils');
const BlacklistToken = require('../db/blacklistToken');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.json(responseUtil.createErrorResponse("Access denied. No token provided.")); 
  }

  try {
    // Check if the token has been revoked
    const isTokenRevoked = await BlacklistToken.exists({ token });
    if (isTokenRevoked) {
      return res.json(responseUtil.createErrorResponse("Access denied. Token revoked."));
    }

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
