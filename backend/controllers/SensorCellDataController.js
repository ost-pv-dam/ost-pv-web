import Cell from '../models/cellModel.js'
import SensorData from '../models/sensorDataModel.js'
import { unlock } from '../middleware/lock.js'

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
        delete sensorCellData._id
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
        temperature: (data.ambient_temp * 9) / 5 + 32
      })

      // Add it to the collection
      const sensorDataDocument = await newSensorData.save()
      const sensorDataOid = sensorDataDocument._id

      for (const cell in data.iv_curves) {
        const newCell = new Cell({
          cellId: cell,
          surfaceTemperature: (data.cell_temperatures[cell] * 9) / 5 + 32,
          ivCurve: data.iv_curves[cell],
          sensorDataOid: sensorDataOid
        })

        await newCell.save()
      }

      // Unlock on-demand polling lock
      unlock()

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

  // Return the current time
  getCurrentTime = async (req, res) => {
    try {
      const date = new Date()

      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minutes = date.getMinutes()
      const seconds = date.getSeconds()

      res.send(
        year +
          ',' +
          month +
          ',' +
          day +
          ',' +
          hour +
          ',' +
          minutes +
          ',' +
          seconds
      )
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: 'Server error' })
    }
  }

  // Given a timestamp, find the nearest transmission
  getNearestTransmission = async (req, res) => {
    try {
      const target = new Date(req.params.timestamp)

      const nearest = await SensorData.aggregate([
        {
          $addFields: {
            absoluteDifference: { $abs: { $subtract: ['$timestamp', target] } }
          }
        },
        {
          $sort: { absoluteDifference: 1 }
        },
        {
          $limit: 1
        }
      ])

      if (nearest.length === 0) {
        return res.status(404).json({ message: 'No nearest sensor data found' })
      }

      const sensorCellData = await this.mergeData(nearest[0])

      return res.status(200).json(sensorCellData)
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  pollNow = async (req, res) => {
    // TODO: Send request to MCU to poll
    res.status(200).json({
      type: 'loading',
      content:
        'Data is being captured! This might take a few minutes - the website will automatically reload when ready.'
    })
  }
}

export default SensorCellDataController
