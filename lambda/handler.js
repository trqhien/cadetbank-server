const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

const dynamodb = new DynamoDBClient({ 
  endpoint: "http://localhost:8000",
  region: "ap-southeast-1" 
});

exports.handler = async (event) => {
  try {
    const { Records } = event;
    for (const record of Records) {
      // if (record.eventName === 'INSERT') {
      //   // Extract transaction data from DynamoDB stream record
      //   const transactionDetails = record.dynamodb.NewImage;

      //   // Logic to update fund balances based on transaction details
      //   const sourceFundId = transactionDetails.sourceFundId.S;
      //   const amount = parseFloat(transactionDetails.amount.N);
      //   // ... (Extract other transaction attributes)

      //   // Update fund balance in the Funds table (Example - Update the balance of the source fund)
      //   const updateParams = {
      //     TableName: 'Funds',
      //     Key: {
      //       fundId: { S: sourceFundId }
      //     },
      //     UpdateExpression: 'SET balance = balance - :amount',
      //     ExpressionAttributeValues: {
      //       ':amount': { N: amount.toString() }
      //     }
      //   };

      //   const updateCommand = new UpdateItemCommand(updateParams);
      //   await dynamoDBClient.send(updateCommand);
      // }
      console.log(record)
    }
    return { statusCode: 200, body: 'Funds updated successfully' };
  } catch (error) {
    return { statusCode: 500, body: 'Failed to update funds' };
  }
};
