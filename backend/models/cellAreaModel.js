import mongoose from 'mongoose'

// Hold the ares of the 5 modules/cells
const CellAreaSchema = new mongoose.Schema({
  cellId: { type: Number, required: true },
  area: { type: Number, required: true }
})

const CellArea = mongoose.model('CellArea', CellAreaSchema, 'cellAreas')

export default CellArea
