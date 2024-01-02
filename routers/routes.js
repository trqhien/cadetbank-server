const express = require('express');
const router = express.Router();
const userRoutes = require('./users/userRoutes');
const authRoutes = require('./auth/authRoutes');
const healthRoutes = require('./health/healthRoutes');
const fundsRoutes = require('./funds/fundRoutes');
const transactionsRoutes = require('./transactions/transactionsRoutes');
const settingsRoutes = require('./settings/settingsRoutes');
const porfolioRoutes = require('./portfolio/portfolioRoutes');

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/test', healthRoutes);
router.use('/funds', fundsRoutes)
router.use('/transactions', transactionsRoutes);
router.use('/settings', settingsRoutes);
router.use('/portfolio', porfolioRoutes);

module.exports = router;