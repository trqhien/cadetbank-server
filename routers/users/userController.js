const axios = require('axios');
const bcrypt = require('bcrypt');
const { PutItemCommand, QueryCommand, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { v4: uuidv4 } = require('uuid');
const { dynamodb, UsersTable } = require('../../db/dynamodb');
const responseUtil = require('../../utils/responseUtils');

exports.register = async (req, res) => {
  const { email, accountType, phone, password } = req.body;

  if (
    email === undefined || Object.keys(email).length === 0
    || accountType === undefined || Object.keys(accountType).length === 0
    || phone === undefined || Object.keys(phone).length === 0
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
    const phoneQueryParams = {
      TableName: UsersTable,
      IndexName: 'phone-index',
      KeyConditionExpression: 'phone = :phone',
      ExpressionAttributeValues: {
        ':phone': { S: phone},
      },
    };

    const phoneQueryResult = await dynamodb.send(new QueryCommand(phoneQueryParams));

    if (phoneQueryResult.Count > 0) {
      return res.json(responseUtil.createErrorResponse("Phone number has been register"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Add new user to db
    const putParams = {
      TableName: UsersTable,
      Item: {
        userId: { S: uuidv4() },
        email: { S: email },
        accountType: { S: accountType },
        phone: { S: phone },
        password: { S: hashedPassword },
      },
    };
    const putCommand = new PutItemCommand(putParams);
    await dynamodb.send(putCommand);

    // log in
    const loginResponse = await axios.post(
      "http://localhost:80/api/auth/login",
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

exports.updateDetails = async (req, res) => {
  const { userId } = req.user;
  const newDetails = req.body;

  try {
    const ExpressionAttributeNames = {};
    const ExpressionAttributeValues = {};
    const UpdateExpressionParts = [];


    if (newDetails.username) {
      // Add @ before username
      newDetails.username = `@${newDetails.username}`;

      // Check if the new username is already registered
      const usernameQueryParams = {
        TableName: UsersTable,
        IndexName: 'username-index',
        KeyConditionExpression: 'username = :username',
        ExpressionAttributeValues: {
          ':username': { S: newDetails.username },
        },
        ProjectionExpression: "username"
      };
      const usernameQueryResult = await dynamodb.send(new QueryCommand(usernameQueryParams));

      if (usernameQueryResult.Count > 0) {
        return res.json(responseUtil.createErrorResponse("Username is already registered"));
      } else {
        ExpressionAttributeNames["#username"] = "username";
        ExpressionAttributeValues[":username"] = { S: newDetails.username };
        UpdateExpressionParts.push("#username = :username");
      }
    }

    // Encrypt it before updating
    if (newDetails.password) {
      newDetails.password = await bcrypt.hash(newDetails.password, 10);
      ExpressionAttributeNames["#password"] = "password";
      ExpressionAttributeValues[":password"] = { S: newDetails.password };
      UpdateExpressionParts.push("#password = :password");
    }

    if (newDetails.accountType) {
      ExpressionAttributeNames["#accountType"] = "accountType";
      ExpressionAttributeValues[":accountType"] = { S: newDetails.accountType };
      UpdateExpressionParts.push("#accountType = :accountType");
    }

    // Exclude 'email' field from newDetails if it exists
    if (newDetails.email) {
      delete newDetails.email;
    }

    const idQueryParams = {
      TableName: UsersTable,
      IndexName: 'id-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': { S: userId},
      },
      Limit: 1,
      ProjectionExpression: "email"
    };
    const idQueryResult = await dynamodb.send(new QueryCommand(idQueryParams));
    const userToUpdate = idQueryResult.Items[0]

    const updateParams = {
      TableName: UsersTable,
      Key: {
        "userId": { S: userId },
        "email": { S: userToUpdate.email.S }
      },
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      UpdateExpression: `SET ${UpdateExpressionParts.join(", ")}`,
      ReturnValues: "ALL_NEW"
    };
    const updateOutput = await dynamodb.send(new UpdateItemCommand(updateParams));
    
    if (!updateOutput) {
      return res.json(responseUtil.createErrorResponse('User not found or no updates made'));
    }

    const updatedUser = {
      phone: updateOutput.Attributes.phone.S,
      userId: updateOutput.Attributes.userId.S,
      email: updateOutput.Attributes.email.S,
      accountType: updateOutput.Attributes.accountType.S,
      username: updateOutput.Attributes.username.S,
    };

    res
      .status(200)
      .json(responseUtil.createSuccessResponse({ updatedUser }));
  } catch (error) {
    res.json({ 
      code: 0,
      error: {
        message: 'Internal Server Error' 
      }
    });
  }
};

exports.getUserDetails = async (req, res) => {
  const { userId } = req.user;

  try {
    const idQueryParams = {
      TableName: UsersTable,
      IndexName: 'id-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': { S: userId},
      },
      Limit: 1,
      ProjectionExpression: "email, username, accountType, phone"
    };
    const idQueryResult = await dynamodb.send(new QueryCommand(idQueryParams));
    const userRecord = idQueryResult.Items[0]

    if (!userRecord) {
      return res.json(responseUtil.createErrorResponse("User not found"));
    }

    // Exclude sensitive information (e.g., password) from the response
    const user = {
      username: userRecord.username.S,
      email: userRecord.email.S,
      accountType: userRecord.accountType.S,
      phone: userRecord.phone.S,
    };

    res.status(200).json(
      responseUtil.createSuccessResponse({ user })
    );
  } catch (error) {
    return res.json(responseUtil.createErrorResponse(error));
  }
};

