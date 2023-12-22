const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

// TODO: Create another dynamodb for local usage
const dynamodb = new DynamoDBClient({ 
  // endpoint: "http://localhost:8000",
  region: "ap-southeast-1",
});

const UsersTable = 'users';
const Blacklist = 'blacklist';
const BlacklistTokensTable = 'blacklist-tokens';

module.exports = {
  dynamodb,
  UsersTable,
  BlacklistTokensTable
};