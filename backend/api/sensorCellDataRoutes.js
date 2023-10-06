import express from 'express'
import SensorCellDataController from '../controllers/SensorCellDataController.js'
import { authenticateAPIKey } from '../middleware/auth.js'

const router = express.Router()
const controller = new SensorCellDataController()

// GET: /api/v1/sensorCellData?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
// router.get('/', authenticateAPIKey, controller.getSensorCellData)

// POST: /api/v1/sensorCellData
router.post('/', authenticateAPIKey, controller.postSensorCellData)

// DELETE: /api/v1/sensorCellData/:id
router.delete('/:id', authenticateAPIKey, controller.deleteSensorCellData)

export default router
