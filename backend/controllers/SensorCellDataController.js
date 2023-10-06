import Cell from '../models/cellModel.js'
import SensorData from '../models/sensorDataModel.js'

class SensorCellDataController {
  // Retrieving sensor data
  getSensorCellData = async (req, res) => {
    try {
      const { startDate, endDate } = req.query
      // If both dates are provided, then only return data in between them
      if (startDate && endDate) {
        // Construct a date range
        const startDateObj = new Date(startDate)
        const endDateObj = new Date(endDate)
        const sensorData = await this.model.find({
          timestamp: {
            $gte: startDateObj,
            $lte: endDateObj
          }
        })
        return res.status(200).json(sensorData)
      }
      // If one of the dates isn't provided, return all data
      else console.log(this.sensor)
      const sensorData = await this.model.find()
      return res.status(200).json(sensorData)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Server error' })
    }
  }

  // Creating sensor data
  postSensorCellData = async (req, res) => {
    try {
      const data = req.body
      const apiKey = req.header('x-api-key');

      if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Authentication failed: Unauthorized access' });
      }

      // Construct the sensor data
      const newSensorData = new SensorData({
        timestamp: data.timestamp,
        lightIntensity: 100.01,
        pressure: data.barometric_pressure,
        humidity: data.humidity,
        temperature: data.ambient_temp
      })

      // Add it to the collection
      const sensorDataDocument = await newSensorData.save()
      const sensorDataOid = sensorDataDocument._id

      for (const cell in data.iv_curves) {
        const newCell = new Cell({
          cellId: cell,
          surfaceTemperature: data.cell_temperatures[cell],
          ivCurve: data.iv_curves[cell],
          sensorDataOid: sensorDataOid
        })

        await newCell.save()
      }

      res.status(201).json(newSensorData)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Server error' })
    }
  }

  // Deleting sensor data
  deleteSensorCellData = async (req, res) => {
    try {
      const id = req.params.id

      // Must delete using deleteOne instead of findOneAndDelete becuase
      // the latter uses locks, which isn't allowed in time series collections
      const sensorDataResult = await SensorData.deleteOne({ _id: id })

      const cellResult = await Cell.deleteMany({ sensorDataOid: id })

      // Check to see if a document was deleted
      if (!sensorDataResult.deletedCount || !cellResult.deletedCount) {
        return res.status(404).json({ message: `Entries not found` })
      }
      return res.json({ message: 'Entries deleted successfully' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Server error' })
    }
  }
  
  authenticateAPIKey = async(req, res, next) => {
    const apiKey = req.header('x-api-Key');

    if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(401).json({ message: 'Authentication failed: Invalid API key' });
    }

    next();
  }
}

export default SensorCellDataController
