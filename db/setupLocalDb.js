const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { dynamodb } = require('./dynamodb');

const usersTableParams = {
  TableName: "users",
  KeySchema: [
    { AttributeName: "userId", KeyType: "HASH" },
    { AttributeName: "email", KeyType: "RANGE" }
  ],
  AttributeDefinitions: [
      { AttributeName: "phone", AttributeType: "S" },
      { AttributeName: "userId", AttributeType: "S" },
      { AttributeName: "email", AttributeType: "S" },
      { AttributeName: "username", AttributeType: "S" }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 20,
    WriteCapacityUnits: 20
  },
  GlobalSecondaryIndexes: [
    {
      IndexName: "username-index",
      KeySchema: [
        { AttributeName: "username", KeyType: "HASH" }
      ],
      Projection: {
          ProjectionType: "ALL"
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      },
    },
    {
      IndexName: "email-index",
      KeySchema: [
        { AttributeName: "email", KeyType: "HASH" }
      ],
      Projection: {
        ProjectionType: "ALL"
      },
      ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
      },
    },
    {
      IndexName: "phone-index",
      KeySchema: [
        { AttributeName: "phone", KeyType: "HASH" }
      ],
      Projection: {
          ProjectionType: "ALL"
      },
      ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
      },
    },
    {
      IndexName: "id-index",
      KeySchema: [
        { AttributeName: "userId", KeyType: "HASH" }
      ],
      Projection: {
        ProjectionType: "ALL"
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      },
    }
  ]
}

const blacklistTokensTableParams = {
  TableName: "blacklist-tokens",
  KeySchema: [
    { AttributeName: "token", KeyType: "HASH" }
  ],
  AttributeDefinitions: [
    { AttributeName: "token", AttributeType: "S" }
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

createTable(usersTableParams);
createTable(blacklistTokensTableParams);
