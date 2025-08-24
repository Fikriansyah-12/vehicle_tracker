import express from 'express';
import { generateVehicleReport } from '../controllers/reportController';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
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
 * /api/reports/vehicles:
 *   get:
 *     summary: Generate vehicle report in Excel format
 *     description: |
 *       Generate an Excel report of vehicle status data for the specified date range.
 *       The report includes vehicle name, license plate, status, location, date, and time.
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
 *         description: Excel file download successful
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *             example: attachment; filename="vehicle-report-2023-10-01-to-2023-10-07.xlsx"
 *           Content-Type:
 *             schema:
 *               type: string
 *             example: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
 *           Content-Length:
 *             schema:
 *               type: integer
 *             example: 10240
 *       400:
 *         description: Bad request - Invalid input parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingStartDate:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Start date parameter is required"
 *                     code: "MISSING_PARAMETER"
 *                     details:
 *                       - field: "startDate"
 *                         message: "startDate query parameter is required"
 *               missingEndDate:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "End date parameter is required"
 *                     code: "MISSING_PARAMETER"
 *                     details:
 *                       - field: "endDate"
 *                         message: "endDate query parameter is required"
 *               invalidDateFormat:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Invalid date format"
 *                     code: "INVALID_DATE_FORMAT"
 *                     details:
 *                       - field: "startDate"
 *                         message: "Date must be in YYYY-MM-DD format"
 *                       - field: "endDate"
 *                         message: "Date must be in YYYY-MM-DD format"
 *               invalidDateRange:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Invalid date range"
 *                     code: "INVALID_DATE_RANGE"
 *                     details:
 *                       - field: "endDate"
 *                         message: "End date must be after start date"
 *               dateRangeTooLarge:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Date range too large"
 *                     code: "DATE_RANGE_TOO_LARGE"
 *                     details:
 *                       - field: "endDate"
 *                         message: "Maximum date range is 365 days"
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingToken:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Authentication token is required"
 *                     code: "MISSING_AUTH_TOKEN"
 *               invalidToken:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Invalid or expired authentication token"
 *                     code: "INVALID_AUTH_TOKEN"
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               insufficientPermissions:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Insufficient permissions to generate reports"
 *                     code: "INSUFFICIENT_PERMISSIONS"
 *       404:
 *         description: Not found - No data available for the specified date range
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               noDataFound:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "No vehicle status data found for the specified date range"
 *                     code: "NO_DATA_AVAILABLE"
 *                     details:
 *                       - field: "startDate"
 *                         message: "No records found between 2023-10-01 and 2023-10-07"
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
 *                     message: "Database error occurred while generating report"
 *                     code: "DATABASE_ERROR"
 *               excelGenerationError:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Failed to generate Excel file"
 *                     code: "EXCEL_GENERATION_ERROR"
 *               reportGenerationTimeout:
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Report generation timed out"
 *                     code: "TIMEOUT_ERROR"
 */
router.get('/vehicles', generateVehicleReport);

export default router;