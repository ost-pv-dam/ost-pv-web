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
      console.log(this.sensor)
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

      // Construct the data
      const newSensorData = new this.model({
        timestamp: new Date(),
        [this.sensor]: data[this.sensor]
      })

      // Add it to the collection
      await newSensorData.save()

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
      const result = await this.model.deleteOne({ _id: id })

      // Check to see if a document was deleted
      if (!result.deletedCount) {
        return res.status(404).json({ message: `${this.sensor} not found` })
      }

      return res.json({ message: 'Entry deleted successfully' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Server error' })
    }
  }
}

export default SensorCellDataController
