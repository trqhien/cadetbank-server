// const AWS = require('aws-sdk');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

const dynamodb = new DynamoDBClient({ 
  endpoint: "http://localhost:8000",
  region: "ap-southeast-1" 
});

const UsersTable = 'users';
const Blacklist = 'blacklist';
const BlacklistTokensTable = 'blacklist-tokens';
const FundsTable = 'funds';
const TransactionsTable = 'transactions';

module.exports = {
  dynamodb,
  UsersTable,
  BlacklistTokensTable,
  FundsTable,
  TransactionsTable
};