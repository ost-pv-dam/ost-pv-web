import express from 'express'
import cors from 'cors'
import sensorCellDataRoutes from './api/sensorCellDataRoutes.js'
import userRoutes from './api/userRoutes.js'
import cellAreaRoutes from './api/cellAreaRoutes.js'
import bodyParser from 'body-parser'

const app = express()

app.use(cors())
app.use(express.json())
// Used for raw image processing
app.use(bodyParser.raw({ limit: '10mb', type: 'image/jpeg' }))

// Define the endpoints, route files will add onto specified URLs with
// specific endpoints
app.use('/api/v1/sensorCellData', sensorCellDataRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/cellAreas', cellAreaRoutes)

// If the endpoint is not recognized, return an error
app.use('*', (req, res) => res.status(404).json({ error: 'not found' }))

// Export so we can use it in index.js
export default app
