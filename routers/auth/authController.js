const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const responseUtil = require('../../utils/responseUtils');
const { dynamodb, UsersTable, BlacklistTokensTable } = require('../../db/dynamodb');
const { QueryCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
  const { email, accountType, phone, password } = req.body;

  if (
    email === undefined || Object.keys(email).length === 0
    // || accountType === undefined || Object.keys(accountType).length === 0
    // || phone === undefined || Object.keys(phone).length === 0
    || password === undefined || Object.keys(password).length === 0
  ) {
    return res.json(responseUtil.createErrorResponse("Missing data"));
  }

  try {
    // Check if email has been registered
    const emailQueryParams = {
      TableName: UsersTable,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': { S: email },
      },
      ProjectionExpression: "email"
    };
    const emailQueryResult = await dynamodb.send(new QueryCommand(emailQueryParams));
    if (emailQueryResult.Count > 0) {
      return res.json(responseUtil.createErrorResponse("Email has been registered"));
    }

    // Verify if phone has been registered
    // const phoneQueryParams = {
    //   TableName: UsersTable,
    //   IndexName: 'phone-index',
    //   KeyConditionExpression: 'phone = :phone',
    //   ExpressionAttributeValues: {
    //     ':phone': { S: phone},
    //   },
    // };

    // const phoneQueryResult = await dynamodb.send(new QueryCommand(phoneQueryParams));

    // if (phoneQueryResult.Count > 0) {
    //   return res.json(responseUtil.createErrorResponse("Phone number has been register"));
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Add new user to db
    const putParams = {
      TableName: UsersTable,
      Item: {
        userId: { S: uuidv4() },
        email: { S: email },
        // accountType: { S: accountType },
        // phone: { S: phone },
        password: { S: hashedPassword },
      },
    };
    const putCommand = new PutItemCommand(putParams);
    await dynamodb.send(putCommand);

    // log in
    const loginResponse = await axios.post(
      "http://ec2-13-250-60-209.ap-southeast-1.compute.amazonaws.com/api/auth/login",
      {email, password}
    );

    return res.json(loginResponse.data);
  } catch (error) {
    return res.json({ 
      "code": 0,
      "error": {
        "reason": "An error has occur while registering user."
      }
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (
    !email || Object.keys(email).length === 0
    || !password || Object.keys(password).length === 0
  ) {
    return res.json(responseUtil.createErrorResponse("Missing data"));
  }

  try {
    const userQuery = {
      TableName: UsersTable,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': { S: email },
      },
      Limit: 1,
      ProjectionExpression: "email, password, userId, username, accountType, phone"
    };
    const userQueryResult = await dynamodb.send(new QueryCommand(userQuery));
    const user = userQueryResult.Items[0];

    if (!user) {
      return res.json(responseUtil.createErrorResponse("Authentication failed"));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password.S);

    if (!isPasswordValid) {
      return res.json(responseUtil.createErrorResponse("Authentication failed"));
    }

    const token = jwt.sign({ userId: user.userId.S }, 'secretKey', {expiresIn: '1h'});
    const refreshToken = jwt.sign({ userId: user.userId.S }, 'refreshSecretKey', { expiresIn: '30d' });

    return res.json(
      responseUtil.createSuccessResponse({
        token,
        refreshToken,
        user: {
          username: user.username?.S,
          email: user.email.S,
          accountType: user.accountType?.S,
          phone: user.phone?.S,
        }
      })
    );
  } catch (error) {
    return res.json(responseUtil.createErrorResponse("Authentication failed"));
  }
};

exports.logout = async (req, res) => {
  const token = req.headers.authorization;

  try {
    const putParams = {
      TableName: BlacklistTokensTable,
      Item: {
        token: { S: token },
        createdAt: { N: Math.floor(new Date().getTime() / 1000) },
      },
    };
    const putCommand = new PutItemCommand(putParams);
    await dynamodb.send(putCommand);

    return res.json(
      responseUtil.createSuccessResponse({
        message: "Logged out successfully"
      })
    );
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error" });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, 'refreshSecretKey');
    
    // Check if the refresh token is valid
    const userQuery = {
      TableName: UsersTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': { S: decoded.userId },
      },
      Limit: 1,
      ProjectionExpression: "userId"
    };

    const userQueryResult = await dynamodb.send(new QueryCommand(userQuery));
    const user = userQueryResult.Items[0];

    // TODO: Add expired token to blacklist

    if (!user) {
      return res.json(responseUtil.createErrorResponse('Invalid or expired refresh token'));
    }

    // Generate a new access token
    const accessToken = jwt.sign({ userId: user.userId.S }, 'secretKey', { expiresIn: '1h' });
    return res
      .status(200)
      .json({ accessToken });
  } catch (error) {
    res.json(responseUtil.createErrorResponse('Invalid or expired refresh token'));
  }
};
