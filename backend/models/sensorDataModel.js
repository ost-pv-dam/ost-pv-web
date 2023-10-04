import { Decimal128 } from 'mongodb'
import mongoose from 'mongoose'

// Define what should be in each collection. We will create one of these
// models for each type of data we collect.
const SensorDataSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, required: true },
    lightIntensity: { type: Decimal128, required: true },
    pressure: { type: Decimal128, required: true },
    humidity: { type: Decimal128, required: true },
    temperature: { type: Decimal128, required: true }
  },
  {
    // Timeseries collection must have a timeField and are specialized by MongoDB
    // for quick read and writes. They do this by keeping data with similar timestamps
    // in the same buckets as they are more likely to be read together.
    timeseries: {
      timeField: 'timestamp',
      granularity: 'seconds'
    }
  }
)

// Tell mongoose the name of the model, the schema, and name of the collection
const SensorData = mongoose.model('SensorData', SensorDataSchema, 'sensorData')

export default SensorData
