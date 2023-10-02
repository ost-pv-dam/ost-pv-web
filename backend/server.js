import express from 'express'
import cors from 'cors'
import sensorCellDataRoutes from './api/sensorCellDataRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

// Define the endpoints
app.use('/api/v1/sensorCellData', sensorCellDataRoutes)

// If the endpoint is not recognized, return an error
app.use('*', (req, res) => res.status(404).json({ error: 'not found' }))

// Export so we can use it in index.js
export default app
