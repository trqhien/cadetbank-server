const { PutItemCommand } = require('@aws-sdk/client-dynamodb');
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