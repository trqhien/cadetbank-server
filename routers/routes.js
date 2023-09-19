const express = require('express');
const router = express.Router();
const userRoutes = require('./users/userRoutes');
const authRoutes = require('./auth/authRoutes');
const healthRoutes = require('./health/healthRoutes');

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/test', healthRoutes);

module.exports = router;