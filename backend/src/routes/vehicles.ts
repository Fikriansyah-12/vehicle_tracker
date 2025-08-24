import express from 'express';
import { getVehicles, getVehicleStatus } from '../controllers/vehicleController';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicle:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Delivery Van 1"
 *         license_plate:
 *           type: string
 *           example: "B 1234 ABC"
 *         model:
 *           type: string
 *           example: "Ford Transit"
 *         year:
 *           type: integer
 *           example: 2020
 *         status:
 *           type: string
 *           example: "active"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2023-10-01T00:00:00.000Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2023-10-01T00:00:00.000Z"
 * 
 *     VehicleStatus:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         vehicle_id:
 *           type: integer
 *           example: 1
 *         status:
 *           type: string
 *           enum: [trip, idle, stopped]
 *           example: "trip"
 *         location:
 *           type: string
 *           example: "Jakarta"
 *         date:
 *           type: string
 *           format: date
 *           example: "2023-10-01"
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: "2023-10-01T08:30:00.000Z"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2023-10-01T08:30:00.000Z"
 *         vehicle_name:
 *           type: string
 *           example: "Delivery Van 1"
 *         license_plate:
 *           type: string
 *           example: "B 1234 ABC"
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
 */

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get all vehicles with pagination
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     vehicles:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Vehicle'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         total:
 *                           type: integer
 *                           example: 5
 *                         pages:
 *                           type: integer
 *                           example: 1
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               unauthorized:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Authentication token is required"
 *                     code: "UNAUTHORIZED"
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               forbidden:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Insufficient permissions to access this resource"
 *                     code: "FORBIDDEN"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               serverError:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Internal server error occurred while fetching vehicles"
 *                     code: "INTERNAL_SERVER_ERROR"
 */
router.get('/', getVehicles);

/**
 * @swagger
 * /api/vehicles/{id}/status:
 *   get:
 *     summary: Get vehicle status by date
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Vehicle ID
 *         example: 1
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format
 *         example: "2023-10-01"
 *     responses:
 *       200:
 *         description: Vehicle status data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/VehicleStatus'
 *       400:
 *         description: Bad request - Invalid input parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidDate:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Invalid date format. Please use YYYY-MM-DD format"
 *                     code: "INVALID_DATE_FORMAT"
 *                     details:
 *                       - field: "date"
 *                         message: "Date must be in YYYY-MM-DD format"
 *               missingDate:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Date parameter is required"
 *                     code: "MISSING_PARAMETER"
 *                     details:
 *                       - field: "date"
 *                         message: "Date query parameter is required"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               unauthorized:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Authentication token is required"
 *                     code: "UNAUTHORIZED"
 *       404:
 *         description: Not found - Vehicle or data not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               vehicleNotFound:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Vehicle not found with ID 999"
 *                     code: "VEHICLE_NOT_FOUND"
 *               noStatusData:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "No status data found for vehicle 1 on date 2023-10-01"
 *                     code: "NO_STATUS_DATA"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               serverError:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Internal server error occurred while fetching vehicle status"
 *                     code: "INTERNAL_SERVER_ERROR"
 */
router.get('/:id/status', getVehicleStatus);

export default router;