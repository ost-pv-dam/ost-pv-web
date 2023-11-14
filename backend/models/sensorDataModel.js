import mongoose from 'mongoose'

// Holds the environmental data for a transmission
const SensorDataSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, required: true },
    lightIntensity: { type: Number, required: true },
    pressure: { type: Number, required: true },
    humidity: { type: Number, required: true },
    temperature: { type: Number, required: true }
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

SensorDataSchema.set('toJSON', {
  transform: (doc, ret) => {
    // Delete info before downloading csv
    delete ret.__v
    return ret
  }
})

// Tell mongoose the name of the model, the schema, and name of the collection
const SensorData = mongoose.model('SensorData', SensorDataSchema, 'sensorData')

export default SensorData
