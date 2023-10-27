import Cell from '../models/cellModel.js'
import SensorData from '../models/sensorDataModel.js'

class SensorCellDataController {
  // Helper function to retrieve corresponding cell data
  mergeData = async (sensorData) => {
    const relatedData = await Cell.find({ sensorDataOid: sensorData._id })
    sensorData.cells = relatedData
    return sensorData
  }

  // Retrieving most recent sensor data
  getMostRecent = async (req, res) => {
    try {
      const mostRecent = await SensorData.findOne().sort({ timestamp: -1 })

      if (!mostRecent) {
        return res.status(404).json({ message: 'No data found' })
      }

      const sensorCellData = await this.mergeData(mostRecent.toJSON())

      res.status(200).json(sensorCellData)
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  getPeriod = async (req, res) => {
    try {
      const startDate = new Date(req.params.startDate)
      const endDate = new Date(req.params.endDate)
      const sensorData = await SensorData.find({
        timestamp: {
          $gte: startDate,
          $lte: endDate
        }
      })

      const combinedPromiseData = sensorData.map(async (sensorDataObj) => {
        const sensorCellData = await this.mergeData(sensorDataObj.toJSON())
        return sensorCellData
      })

      const combinedData = await Promise.all(combinedPromiseData)
      res.status(200).json(combinedData)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  }

  // Get the next transmission
  getNext = async (req, res) => {
    try {
      const currTimestamp = new Date(req.params.timestamp)

      const next = await SensorData.findOne({
        timestamp: { $gt: currTimestamp }
      }).sort({ timestamp: 1 })

      if (!next) {
        return res.status(404).json({ message: 'No next sensor data found' })
      }

      const sensorCellData = await this.mergeData(next.toJSON())

      return res.status(200).json(sensorCellData)
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  // Get the previous transmission
  getPrev = async (req, res) => {
    try {
      const currTimestamp = new Date(req.params.timestamp)

      const prev = await SensorData.findOne({
        timestamp: { $lt: currTimestamp }
      }).sort({ timestamp: -1 })

      if (!prev) {
        return res
          .status(404)
          .json({ message: 'No previous sensor data found' })
      }

      const sensorCellData = await this.mergeData(prev.toJSON())

      res.status(200).json(sensorCellData)
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  // Creating sensor data
  postSensorCellData = async (req, res) => {
    try {
      const data = req.body
      const ts = new Date(data.timestamp * 1000)
      // Construct the sensor data
      const newSensorData = new SensorData({
        timestamp: ts,
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

      res.status(201).json({ _id: newSensorData._id })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
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
      res.json({ message: 'Entries deleted successfully' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  }
}

export default SensorCellDataController
