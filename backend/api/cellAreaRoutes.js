import express from 'express'
import CellAreaController from '../controllers/CellAreaController.js'
import { authenticateAPIKey } from '../middleware/auth.js'

const router = express.Router()
const controller = new CellAreaController()

// GET: /api/v1/cellAreas/:id
router.get('/:cellId', authenticateAPIKey, controller.getCellArea)

export default router
