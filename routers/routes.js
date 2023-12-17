const express = require('express');
const router = express.Router();
const userRoutes = require('./users/userRoutes');
const authRoutes = require('./auth/authRoutes');
const healthRoutes = require('./health/healthRoutes');
const fundsRoutes = require('./funds/fundRoutes');

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/test', healthRoutes);
router.use('/funds', fundsRoutes)

module.exports = router;