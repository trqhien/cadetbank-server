const express = require('express');
const router = express.Router();
const HealthController = require('./healthController');

/**
 * @swagger
 * /test/health:
 *   get:
 *     summary: Perform a health check
 *     tags:
 *       - /test
 *     responses:
 *       200:
 *         description: Server is up and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 serverTime:
 *                   type: string
 *                   example: "2023-09-22T06:24:08.651Z"
 *                 databaseStatus:
 *                   type: string
 *                   example: "Connected"
 */
router.get('/health', HealthController.healthCheck);

/**
 * @swagger
 * /test/404:
 *   get:
 *     summary: Intentionally return 404
 *     tags:
 *       - /test
 *     responses:
 *       400:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not found"
 */
router.get('/404', HealthController.notFound);

/**
 * @swagger
 * /test/500:
 *   get:
 *     summary: Intentionally return 500
 *     tags:
 *       - /test
 *     responses:
 *       400:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get('/500', HealthController.serverError);

/**
 * @swagger
 * /test/greet:
 *   post:
 *     summary: Send a greeting message
 *     tags:
 *       - /test
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Welcome to 2023 Cadetship Program"
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Welcome to 2023 Cadetship Program"
 */
router.post('/greet', HealthController.greet);

module.exports = router;