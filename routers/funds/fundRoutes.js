const express = require('express');
const router = express.Router();
const FundController = require('./fundsController');
const authenticate = require('../../middleware/authenticate');
const fundCreationValidator = require('../../middleware/fundCreationValidator');

router.post('/create', authenticate, fundCreationValidator, FundController.createFund);

module.exports = router;