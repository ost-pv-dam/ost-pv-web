import express from 'express'
import SensorCellDataController from '../controllers/SensorCellDataController.js'
import { authenticateAPIKey } from '../middleware/auth.js'
import { checkAndSetLock, isLocked } from '../middleware/lock.js'
import PhotoController from '../controllers/PhotoController.js'

const router = express.Router()
const controller = new SensorCellDataController()
const photoController = new PhotoController()

// GET: /api/v1/sensorCellData (most recent)
router.get('/', authenticateAPIKey, controller.getMostRecent)

// GET: /api/v1/sensorCellData/period/:startDate/:endDate (YYYY-MM-DD)
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

// GET: /api/v1/sensorCellData/getCurrentTime
router.get('/getCurrentTime', authenticateAPIKey, controller.getCurrentTime)

// GET: /api/v1/sensorCellData/nearestTransmission/:timestamp
router.get(
  '/nearestTransmission/:timestamp',
  authenticateAPIKey,
  controller.getNearestTransmission
)

// Poll now lock endpoints

// POST: /api/v1/sensorCellData/pollNow
router.post('/pollNow', authenticateAPIKey, checkAndSetLock, controller.pollNow)

// GET: /api/v1/sensorCellData/isLocked
router.get('/isLocked', authenticateAPIKey, isLocked)

// Photo endpoints

// POST: /api/v1/sensorCellData/uploadPhoto
router.post('/uploadPhoto', authenticateAPIKey, photoController.uploadPhoto)

// GET: /api/v1/sensorCellData/getPhoto/:timestamp
router.get(
  '/getPhoto/:timestamp',
  authenticateAPIKey,
  photoController.getPhotoUrl
)

export default router
