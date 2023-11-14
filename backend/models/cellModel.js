import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'

// Holds all of the data belonging to an individual cell/module
const CellSchema = new mongoose.Schema({
  cellId: { type: Number, required: true },
  surfaceTemperature: { type: Number, required: true },
  ivCurve: [
    {
      voltage: { type: Number, required: true },
      current: { type: Number, required: true }
    }
  ],
  // Connect back to sensor data document
  sensorDataOid: { type: ObjectId, required: true },
  pMax: {
    pair: {
      voltage: { type: Number, required: true },
      current: { type: Number, required: true }
    },
    value: { type: Number, required: true }
  }
})

CellSchema.set('toJSON', {
  transform: (doc, ret) => {
    // Delete info before donwloading csv
    delete ret._id
    delete ret.__v
    delete ret.sensorDataOid

    ret.ivCurve.forEach((curve) => {
      delete curve._id
    })

    return ret
  }
})

const Cell = mongoose.model('Cell', CellSchema, 'cells')

export default Cell
