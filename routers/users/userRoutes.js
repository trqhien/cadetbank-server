const express = require('express');
const router = express.Router();
const UserController = require('./userController');
const authenticate = require('../../middleware/authenticate');

router.get('/register', UserController.register);
router.post('/update', authenticate, UserController.updateDetails);
router.get('/details', authenticate, UserController.getUserDetails);

module.exports = router;