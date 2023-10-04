import { Decimal128, Int32, ObjectId } from 'mongodb'
import mongoose from 'mongoose'

// Define what should be in each collection. We will create one of these
// models for each type of data we collect.
const CellSchema = new mongoose.Schema({
  cellId: { type: Number, required: true },
  surfaceTemperature: { type: Decimal128, required: true },
  ivCurve: [
    {
      voltage: { type: Decimal128, required: true },
      current: { type: Decimal128, required: true }
    }
  ],
  sensorDataOid: { type: ObjectId, requied: true }
})

// Tell mongoose the name of the model, the schema, and name of the collection
const Cell = mongoose.model('Cell', CellSchema, 'cells')

export default Cell
