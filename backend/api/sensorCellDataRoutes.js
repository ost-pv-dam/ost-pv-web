import express from 'express'
import SensorCellDataController from '../controllers/SensorCellDataController.js'

const router = express.Router()
const controller = new SensorCellDataController()

// GET: /api/v1/sensorCellData?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
// router.get('/', controller.getSensorCellData)

// POST: /api/v1/sensorCellData
router.post('/', controller.authenticateAPIKey, controller.postSensorCellData)

// DELETE: /api/v1/sensorCellData/:id
router.delete('/:id', controller.deleteSensorCellData)

export default router
