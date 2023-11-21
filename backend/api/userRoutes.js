import express from 'express'
import UserController from '../controllers/UserController.js'
import { authenticateAPIKey } from '../middleware/auth.js'

const router = express.Router()
const controller = new UserController()

// GET: /api/v1/users/isAuthorized/:email
router.get(
  '/isAuthorized/:email',
  authenticateAPIKey,
  controller.isAuthorizedUser
)

export default router
