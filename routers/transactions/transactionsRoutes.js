const express = require('express');
const router = express.Router();
const TransactionsController = require('./transactionsController');
const authenticate = require('../../middleware/authenticate');
const inOutTransactionValidator = require('../../middleware/inOutTransactionValidator');

router.post('/record', authenticate, inOutTransactionValidator, TransactionsController.recordTransaction);

module.exports = router;