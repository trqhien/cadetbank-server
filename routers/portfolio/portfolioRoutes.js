const express = require('express');
const router = express.Router();
const PortfolioController = require('./portfolioController');
const authenticate = require('../../middleware/authenticate');

router.get('/networth', authenticate, PortfolioController.calculateNetworth);

module.exports = router;
