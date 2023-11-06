import { Decimal128, Int32, ObjectId } from 'mongodb'
import mongoose from 'mongoose'

// Define what should be in each collection. We will create one of these
// models for each type of data we collect.
const CellAreaSchema = new mongoose.Schema({
  cellId: { type: Number, required: true },
  area: { type: Decimal128, required: true }
})

// Tell mongoose the name of the model, the schema, and name of the collection
const CellArea = mongoose.model('CellArea', CellAreaSchema, 'cellAreas')

export default CellArea
