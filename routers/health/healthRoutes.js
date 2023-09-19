const express = require('express');
const router = express.Router();
const HealthController = require('./healthController');

router.get('/health', HealthController.healthCheck);
router.get('/404', HealthController.notFound);
router.get('/500', HealthController.serverError);
router.post('/greet', HealthController.greet);

module.exports = router;