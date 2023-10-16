import express from 'express'
import SensorCellDataController from '../controllers/SensorCellDataController.js'
import { authenticateAPIKey } from '../middleware/auth.js'

const router = express.Router()
const controller = new SensorCellDataController()

// GET: /api/v1/sensorCellData (most recent)
router.get('/', authenticateAPIKey, controller.getMostRecent)

// GET: /api/v1/sensorCellData/:startDate/:endDate (YYYY-MM-DD)
router.get(
  '/period/:startDate/:endDate',
  authenticateAPIKey,
  controller.getPeriod
)

// GET: /api/v1/sensorCellData/next/:timestamp
router.get('/next/:timestamp', authenticateAPIKey, controller.getNext)

// GET: /api/v1/sensorCellData/prev/:timestamp
router.get('/prev/:timestamp', authenticateAPIKey, controller.getPrev)

// POST: /api/v1/sensorCellData
router.post('/', authenticateAPIKey, controller.postSensorCellData)

// DELETE: /api/v1/sensorCellData/:id
router.delete('/:id', authenticateAPIKey, controller.deleteSensorCellData)

export default router
