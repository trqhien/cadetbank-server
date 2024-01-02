const { QueryCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { dynamodb, FundsTable, SettingsTable } = require('../../db/dynamodb');
const responseUtil = require('../../utils/responseUtils');

const usdRates = {
  USD: 1,
  VND: 24384.09
};

const vndRates = {
  USD: 0.00004101034732,
  VND: 1
};

exports.calculateNetworth = async (req, res) => {
  const { userId } = req.user;

  const settingsGetParam = {
    TableName: SettingsTable,
    Key: {
      userId: {S: userId }
    }
  };

  const queryParams = {
    TableName: FundsTable,
    IndexName: 'creator-id-index',
    KeyConditionExpression: 'creatorId = :c',
    FilterExpression: 'fundType = :type',
    ExpressionAttributeValues: {
      ':c': { S: userId }, 
      ':type': { S: 'fiat' },
    },
  };

  try {
    const { Item: settings } = await dynamodb.send(new GetItemCommand(settingsGetParam));

    if (!settings) {
      return res.json(responseUtil.createErrorResponse("Settings not found")); 
    }

    const { Items } = await dynamodb.send(new QueryCommand(queryParams));

    const networth = Items.reduce((current, item) => {
      const currency = item.currency.S;
      const balance = parseFloat(item.balance.N);
      
      if (currency === settings.baseCurrency.S) {
        current += balance
      } else {
        current += balance * usdRates[settings.baseCurrency.S];
      }

      return current;
    }, 0);

    res
      .status(200)
      .json(responseUtil.createSuccessResponse({ 
        networth,
        currency: settings.baseCurrency.S
      }));
  } catch (error) {
    return res
      .status(500)
      .json(responseUtil.createErrorResponse(`${error}`));
  }
}
