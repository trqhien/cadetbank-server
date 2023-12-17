const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { dynamodb } = require('../dynamodb');

const fundsTableParams = {
  TableName: "funds",
  KeySchema: [
    { AttributeName: "fundId", KeyType: "HASH" },
    { AttributeName: "creatorId", KeyType: "RANGE" }
  ],
  AttributeDefinitions: [
    { AttributeName: "fundId", AttributeType: "S" },
    { AttributeName: "creatorId", AttributeType: "S" },
    // { AttributeName: "balance", AttributeType: "N" },
    // { AttributeName: "fundType", AttributeType: "S" }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  },
}

const createTable = async (params) => {
  try {
    await dynamodb.send(new CreateTableCommand(params));
    console.log(`Table ${params.TableName} created successfully.`);
  } catch (error) {
    console.error(`Error creating table ${params.TableName}:`, error);
  }
};

createTable(fundsTableParams);
