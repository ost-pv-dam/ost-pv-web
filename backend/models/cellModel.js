import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'

// Define what should be in each collection. We will create one of these
// models for each type of data we collect.
const CellSchema = new mongoose.Schema({
  cellId: { type: Number, required: true },
  surfaceTemperature: { type: Number, required: true },
  ivCurve: [
    {
      voltage: { type: Number, required: true },
      current: { type: Number, required: true }
    }
  ],
  sensorDataOid: { type: ObjectId, requied: true }
})

CellSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id
    delete ret.__v
    delete ret.sensorDataOid

    ret.ivCurve.forEach((curve) => {
      delete curve._id
    })

    return ret
  }
})

// Tell mongoose the name of the model, the schema, and name of the collection
const Cell = mongoose.model('Cell', CellSchema, 'cells')

export default Cell
