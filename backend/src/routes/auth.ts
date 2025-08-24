import express from 'express';
import { login } from '../controllers/authController';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: admin@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: admin123
 * 
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTcyNzQ4MDQwMCwiZXhwIjoxNzI3NDg0MDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *             user:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: admin@example.com
 *                 name:
 *                   type: string
 *                   example: Admin User
 *                 role:
 *                   type: string
 *                   example: admin
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             code:
 *               type: string
 *             details:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   field:
 *                     type: string
 *                   message:
 *                     type: string
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Bad request - Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingEmail:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Email and password are required"
 *                     code: "MISSING_REQUIRED_FIELDS"
 *                     details:
 *                       - field: "email"
 *                         message: "Email is required"
 *               missingPassword:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Email and password are required"
 *                     code: "MISSING_REQUIRED_FIELDS"
 *                     details:
 *                       - field: "password"
 *                         message: "Password is required"
 *               invalidEmailFormat:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Invalid email format"
 *                     code: "INVALID_EMAIL_FORMAT"
 *                     details:
 *                       - field: "email"
 *                         message: "Must be a valid email address"
 *               shortPassword:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Password must be at least 6 characters"
 *                     code: "PASSWORD_TOO_SHORT"
 *                     details:
 *                       - field: "password"
 *                         message: "Password must be at least 6 characters long"
 *       401:
 *         description: Unauthorized - Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               userNotFound:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Invalid email or password"
 *                     code: "INVALID_CREDENTIALS"
 *               incorrectPassword:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Invalid email or password"
 *                     code: "INVALID_CREDENTIALS"
 *               accountLocked:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Account temporarily locked due to multiple failed attempts"
 *                     code: "ACCOUNT_LOCKED"
 *       429:
 *         description: Too many requests - Rate limiting
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               rateLimit:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Too many login attempts. Please try again in 15 minutes."
 *                     code: "RATE_LIMIT_EXCEEDED"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               databaseError:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Internal server error occurred during authentication"
 *                     code: "INTERNAL_SERVER_ERROR"
 *               tokenGenerationError:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Failed to generate authentication token"
 *                     code: "TOKEN_GENERATION_ERROR"
 */
router.post('/login', login);

export default router;