const mongoose = require('mongoose');

exports.healthCheck = async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
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
  // console.log(req.headers.token);
  // console.log(req.body.message);
  const { greetMessage } = req.body;

  return res.status(200).json({ greetMessage });
}