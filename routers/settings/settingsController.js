const { UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { dynamodb, SettingsTable } = require('../../db/dynamodb');
const responseUtil = require('../../utils/responseUtils');

exports.updateSettings = async (req, res) => {
  const { userId } = req.user;
  const { baseCurrency } = req.body;

  // TODO: Validate currency code

  if (!baseCurrency) {
    res.json(responseUtil.createErrorResponse("Base currency not found"));
  }

  try {
    const updateParams = {
      TableName: SettingsTable,
      Key: {
        "userId": { S: userId },
      },
      ExpressionAttributeValues: {
        ":newBaseCurrency": { S: baseCurrency }
      },
      UpdateExpression: 'SET baseCurrency = :newBaseCurrency',
      ReturnValues: "ALL_NEW"
    };

    const updateOutput = await dynamodb.send(new UpdateItemCommand(updateParams));
    
    if (!updateOutput) {
      return res.json(responseUtil.createErrorResponse("An error has occured while updating user's settings"));
    }
    res
      .status(200)
      .json({ 
        updatedSettings: {
          baseCurrency: updateOutput.Attributes.baseCurrency.S
        }
      });
  } catch (error) {
    res.status(500).json({ error });
  }
}
