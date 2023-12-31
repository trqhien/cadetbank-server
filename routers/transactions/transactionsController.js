const { PutItemCommand, QueryCommand, GetItemCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
const { v4: uuidv4 } = require('uuid');
const { dynamodb, TransactionsTable, FundsTable } = require('../../db/dynamodb');
const responseUtil = require('../../utils/responseUtils');

exports.recordTransaction = async (req, res) => {
  const { userId } = req.user;
  const { sourceFundId, destinationFundId, amount, type, description } = req.body;

  try {
    // Retrieve source fund
    const getSourceFundParams = {
      TableName: FundsTable,
      Key: { 
        fundId: { S: sourceFundId },
        creatorId: { S: userId }
      },
    };
  
    const { Item: sourceFund } = await dynamodb.send(new GetItemCommand(getSourceFundParams));

    if (!sourceFund) {
      res
      .status(200)
      .json(responseUtil.createErrorResponse("Invalid source fund"));
      return;
    }

    // Retrieve destination fund
    var destinationFund;

    if (destinationFundId) {
      const getDestinationFundParams = {
        TableName: FundsTable,
        Key: { 
          fundId: { S: destinationFundId },
          creatorId: { S: userId }
        },
      };
    
      const { Item } = await dynamodb.send(new GetItemCommand(getDestinationFundParams));
      destinationFund = Item;
    }
    
    // Check if amount is less than or equal to the source fund balance
    const sourceFundBalance = parseFloat(sourceFund.balance.N);
    if (amount > sourceFundBalance) {
      res
        .status(200)
        .json(responseUtil.createErrorResponse("Transferred amount exceeds source fund balance"));
      return;
    }

    const transactionParams = {
      TableName: TransactionsTable,
      Item: {
        transactionId: { S: uuidv4() },
        timestamp: { N: `${Date.now()}` },
        sourceFundId: { S: sourceFundId },
        amount: { N: amount },
        type: { S: "inout" },
        userId: { S: userId },
        currency: { S: sourceFund.currency.S },
        description: { S: description || (
          !destinationFund
            ? `Transfer out from ${sourceFund.name.S}`
            : `Transfer out from ${sourceFund.name.S} to ${destinationFund.name.S}`
        )}
      }
    };

    if (destinationFund) {
      transactionParams.Item.destinationFundId = { S: destinationFundId }
    }

    const putTransactionCommand = new PutItemCommand(transactionParams);
    await dynamodb.send(putTransactionCommand);

    res
      .status(200)
      .json(responseUtil.createSuccessResponse({
        transactionId: transactionParams.Item.transactionId.S,
        timestamp: Number(transactionParams.Item.timestamp.N),
        sourceFundId: transactionParams.Item.sourceFundId.S,
        destinationFundId: transactionParams.Item.destinationFundId?.S,
        amount: transactionParams.Item.amount.N,
        type: transactionParams.Item.type.S,
        userId: transactionParams.Item.userId.S,
        currency: transactionParams.Item.currency.S,
        description: transactionParams.Item.description.S,
      }));
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json(responseUtil.createErrorResponse(`${err}`));
  }
}

exports.getTransactions = async (req, res) => {
  const { userId } = req.user;

  try {
    const queryParams = {
      TableName: TransactionsTable,
      IndexName: 'user-id-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': { S: userId }
      },
      // ProjectionExpression: "fundId, #fundName, balance, fundType, description, currency",
      // ExpressionAttributeNames: {
      //   '#fundName': 'name' // Use alias here as name is areserved keyword
      // }
    };

    const { Items } = await dynamodb.send(new QueryCommand(queryParams));

    const transactions = Items.map(item => ({
      transactionId: item.transactionId.S,
      timestamp: Number(item.timestamp.N),
      sourceFundId: item.sourceFundId.S,
      destinationFundId: item.destinationFundId?.S,
      amount: item.amount.N,
      type: item.type.S,
      userId: item.userId.S,
      currency: item.currency.S,
      description: item.description.S,
    }));

    res
      .status(200)
      .json(responseUtil.createSuccessResponse({
        transactions
      }));
  } catch (err) {
    res
      .status(500)
      .json(responseUtil.createErrorResponse(`${err}`));
  }
}
