import express from 'express'
import UserController from '../controllers/UserController.js'
import { authenticateAPIKey } from '../middleware/auth.js'

const router = express.Router()
const controller = new UserController()

// GET: /api/v1/users (most recent)
router.get('/', authenticateAPIKey, controller.getUsers)

export default router
