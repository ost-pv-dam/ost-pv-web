import mongoose from 'mongoose'

// Only one document in this collection
const LockSchema = new mongoose.Schema({
  isLocked: {
    type: Boolean,
    default: false
  }
})

const Lock = mongoose.model('Lock', LockSchema, 'lock')

export default Lock
