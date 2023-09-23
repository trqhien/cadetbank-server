const express = require('express');
const router = express.Router();
const AuthController = require('./authController');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login using an email and password.
 *     tags:
 *       - /auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: mokey.d.luffy@maya.ph
 *               password:
 *                 type: string
 *                 example: Qwerty@123
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
router.post('/login', AuthController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags:
 *       - /auth
 *     summary: Log out user
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
*/
router.post('/logout', AuthController.logout);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     tags:
 *       - /auth
 *     summary: Renew expired token using refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGZjYTg0MzJkNmViYzQ2Zjc3NzU3NjkiLCJpYXQiOjE2OTUxMjMzNTUsImV4cCI6MTY5NzcxNTM1NX0.HFtaNVxz2UZKyC__Epr7LxsOPzVxpZOFlJhFUv-066E
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGZjYTg0MzJkNmViYzQ2Zjc3NzU3NjkiLCJpYXQiOjE2OTUzOTA3NDcsImV4cCI6MTY5NTM5NDM0N30.0fk7QYdAU3A-JstxTe9ID0OTlKVYyZsAp3rkNRo_ohQ
*/
router.post('/refresh-token', AuthController.refreshToken);

module.exports = router;