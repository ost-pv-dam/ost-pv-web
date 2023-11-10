import mongoose from 'mongoose'

const LockSchema = new mongoose.Schema({
  isLocked: {
    type: Boolean,
    default: false
  }
})

const Lock = mongoose.model('Lock', LockSchema, 'lock')

export default Lock
