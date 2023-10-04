const jwt = require('jsonwebtoken');
const responseUtil = require('../utils/responseUtils');
const { dynamodb, BlacklistTokensTable } = require('../db/dynamodb');
const { GetItemCommand } = require('@aws-sdk/client-dynamodb');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.json(responseUtil.createErrorResponse("Access denied. No token provided.")); 
  }

  try {
    // Check if the token has been revoked
    const params = {
      Key: {
        "token": { S: token },
      },
      TableName: BlacklistTokensTable
    };
    const revokedToken = await dynamodb.send(new GetItemCommand(params));

    if (revokedToken.Item) {
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
