const { dynamodb } = require('../../db/dynamodb');
const { ListTablesCommand } = require('@aws-sdk/client-dynamodb');

exports.healthCheck = async (req, res) => {
  try {
    // Check DynamoDB connection by listing tables
    const listTablesCommand = new ListTablesCommand({});
    await dynamodb.send(listTablesCommand);
    var databaseStatus = 'Connected';
  } catch (error) {
    var databaseStatus = 'Error: ' + error.message;
  }

  const serverInfo = {
    status: 'OK',
    serverTime: new Date().toISOString(),
    databaseStatus
  };

  res.status(200).json(serverInfo);
};

exports.notFound = async (req, res) => {
  return res.status(404).json({ message: 'Not found' });
};

exports.serverError = async (req, res) => {
  return res.status(500).json({ message: 'Internal Server Error' });
}

exports.greet = async (req, res) => {
  const { message } = req.body;

  return res.status(200).json({ message });
}