import express from 'express';
import { getVehicles, getVehicleStatus } from '../controllers/vehicleController';

const router = express.Router();

router.get('/', getVehicles);
router.get('/:id/status', getVehicleStatus);

export default router;