const express = require('express');
const router = express.Router();
const SettingsController = require('./settingsController');
const authenticate = require('../../middleware/authenticate');

router.post('/update', authenticate, SettingsController.updateSettings);

module.exports = router;
