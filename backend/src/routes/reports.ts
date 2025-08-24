import express from 'express';
import { generateVehicleReport } from '../controllers/reportController';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     VehicleReport:
 *       type: object
 *       properties:
 *         Vehicle Name:
 *           type: string
 *         License Plate:
 *           type: string
 *         Status:
 *           type: string
 *           enum: [trip, idle, stopped]
 *         Location:
 *           type: string
 *         Date:
 *           type: string
 *           format: date
 *         Time:
 *           type: string
 *         Timestamp:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/reports/vehicles:
 *   get:
 *     summary: Generate vehicle report in Excel format
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date in YYYY-MM-DD format
 *         example: 2023-10-01
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date in YYYY-MM-DD format
 *         example: 2023-10-07
 *     responses:
 *       200:
 *         description: Excel file download
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid date format or date range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     details:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No data found for the selected date range
 */
router.get('/vehicles', generateVehicleReport);

export default router;