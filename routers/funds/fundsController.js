const { PutItemCommand, QueryCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { v4: uuidv4 } = require('uuid');
const { dynamodb, FundsTable } = require('../../db/dynamodb');
const responseUtil = require('../../utils/responseUtils');

exports.createFund = async (req, res) => {
  const { userId } = req.user;
  const { fundName, balance, fundType, description, currency } = req.body;

  try {
    const putParams = {
      TableName: FundsTable,
      Item: {
        fundId: { S: uuidv4() },
        creatorId: { S: userId },
        balance: { N: balance },
        fundType: { S: fundType },
        name: {S: fundName },
        currency: {S: currency }
      },
    };

    // Check if description exists and is not null or undefined
    if (description) {
      putParams.Item.description = { S: description };
    }

    const putCommand = new PutItemCommand(putParams);
    await dynamodb.send(putCommand);

    res
      .status(200)
      .json(responseUtil.createSuccessResponse({
        fundId: putParams.Item.fundId.S,
        creatorId: putParams.Item.creatorId.S,
        balance: putParams.Item.balance.N,
        fundType: putParams.Item.fundType.S,
        name: putParams.Item.name.S,
        description: putParams.Item.description?.S,
        currency: putParams.Item.currency.S
      }));
  } catch (err) {
    res
      .status(500)
      .json(responseUtil.createErrorResponse(`${err}`));
  }
}

exports.getFunds = async (req, res) => {
  const { userId } = req.user;

  try {
    const queryParams = {
      TableName: FundsTable,
      IndexName: 'creator-id-index',
      KeyConditionExpression: 'creatorId = :creatorId',
      ExpressionAttributeValues: {
        ':creatorId': { S: userId }
      },
      ProjectionExpression: "fundId, #fundName, balance, fundType, description, currency",
      ExpressionAttributeNames: {
        '#fundName': 'name' // Use alias here as name is areserved keyword
      }
    };

    const { Items } = await dynamodb.send(new QueryCommand(queryParams));

    const funds = Items.map(item => ({
      fundId: item.fundId.S,
      balance: parseFloat(item.balance.N),
      fundType: item.fundType.S,
      name: item.name.S,
      currency: item.currency.S,
      description: item.description?.S
    }));

    res
      .status(200)
      .json(responseUtil.createSuccessResponse({
        funds
      }));
  } catch (err) {
    // const stackTrace = err.stack.split('\n')[1].trim(); 
    // console.log(stackTrace)
    res
      .status(500)
      .json(responseUtil.createErrorResponse(`${err}`));
  }
}

exports.fundDetails = async (req, res) => {
  const { userId } = req.user;
  const fundId = req.params.fundId;

  try {
    const getItemParams = {
      TableName: FundsTable,
      Key: { 
        fundId: { S: fundId },
        creatorId: { S: userId }
      },
    };
  
    const { Item } = await dynamodb.send(new GetItemCommand(getItemParams));

    res
      .status(200)
      .json(responseUtil.createSuccessResponse({
        fundId: Item.fundId.S,
        balance: parseFloat(Item.balance.N),
        fundType: Item.fundType.S,
        name: Item.name.S,
        currency: Item.currency.S,
        description: Item.description?.S
      }));
  } catch (err) {
    const stackTrace = err.stack.split('\n')[1].trim(); 
    console.log(stackTrace)
    res
      .status(500)
      .json(responseUtil.createErrorResponse(`${err}`));
  }
}