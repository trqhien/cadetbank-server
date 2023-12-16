const express = require('express');
const router = express.Router();
const UserController = require('./userController');
const authenticate = require('../../middleware/authenticate');

/**
 * @swagger
 * /users/register:
 *   get:
 *     summary: Register user.
 *     tags:
 *       - /users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: '+63123456789'
 *               password:
 *                 type: string
 *                 example: qw3rtY@123
 *               accountType:
 *                 type: string
 *                 example: personal
 *               email:
 *                 type: string
 *                 example: mokey.d.luffy@maya.ph
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: int
 *                   example: 1
 *                 response:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGZkNGQ2ZjJkNmViYzQ2Zjc3NzU3NzciLCJpYXQiOjE2OTUzOTAwMjcsImV4cCI6MTY5NTM5MDAzN30.QLL9J9po67KEYVezY1p3b7jumokN-iCzNtKG81xCaWI
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGZkNGQ2ZjJkNmViYzQ2Zjc3NzU3NzciLCJpYXQiOjE2OTUzOTAwMjcsImV4cCI6MTY5Nzk4MjAyN30.bXrm-bFD9iEbMUSt3jLmKr2WxvSPHy658acHE42XQL8
 *                     user:
 *                       type: object
 *                       properties:
 *                         username:
 *                           type: string
 *                           example: pirate_king
 *                         email:
 *                           type: string
 *                           example: mokey.d.luffy@maya.ph
 *                         accountType:
 *                           type: string
 *                           example: personal
 *                         phone:
 *                           type: string
 *                           example: +63123456789
*/
router.post('/register', UserController.register);

/**
 * @swagger
 * /users/update:
 *   post:
 *     summary: Update user details.
 *     tags:
 *       - /users
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: straw_hat
 *               phone:
 *                 type: string
 *                 example: '+63123456789'
 *               password:
 *                 type: string
 *                 example: qw3rtY@123
 *               accountType:
 *                 type: string
 *                 example: personal
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: int
 *                   example: 1
 *                 response:
 *                   type: object
 *                   properties:
 *                     updatedUser:
 *                       type: object
 *                       properties:
 *                         username:
 *                           type: string
 *                           example: straw_hat
 *                         email:
 *                           type: string
 *                           example: mokey.d.luffy@maya.ph
 *                         accountType:
 *                           type: string
 *                           example: personal
 *                         phone:
 *                           type: string
 *                           example: '+63123456789'
*/
router.post('/update', authenticate, UserController.updateDetails);

/**
 * @swagger
 * /users/details:
 *   get:
 *     summary: Get user details.
 *     tags:
 *       - /users
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieve user detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: int
 *                   example: 1
 *                 response:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         username:
 *                           type: string
 *                           example: straw_hat
 *                         email:
 *                           type: string
 *                           example: mokey.d.luffy@maya.ph
 *                         accountType:
 *                           type: string
 *                           example: personal
 *                         phone:
 *                           type: string
 *                           example: '+63123456789'
*/
router.get('/details', authenticate, UserController.getUserDetails);

module.exports = router;