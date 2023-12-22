const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { dynamodb } = require('../dynamodb');

const transactionsTableParams = {
  TableName: "transactions",
  KeySchema: [
    { AttributeName: "transactionId", KeyType: "HASH" },
    { AttributeName: "timestamp", KeyType: "RANGE" },
  ],
  AttributeDefinitions: [
    { "AttributeName": "transactionId", "AttributeType": "S" },
    { "AttributeName": "timestamp", "AttributeType": "N" },
    { "AttributeName": "sourceFundId", "AttributeType": "S" },
    { "AttributeName": "destinationFundId", "AttributeType": "S" },
    { "AttributeName": "amount", "AttributeType": "N" },
    { "AttributeName": "type", "AttributeType": "S" },
    { "AttributeName": "description", "AttributeType": "S" },
    { "AttributeName": "userId", "AttributeType": "S" }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: "user-id-index",
      KeySchema: [
        {
          AttributeName: "userId",
          KeyType: "HASH"
        }
      ],
      Projection: {
        ProjectionType: "ALL"
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
}

const createTable = async (params) => {
  try {
    await dynamodb.send(new CreateTableCommand(params));
    console.log(`Table ${params.TableName} created successfully.`);
  } catch (error) {
    console.error(`Error creating table ${params.TableName}:`, error);
  }
};

createTable(transactionsTableParams);