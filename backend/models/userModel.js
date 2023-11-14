import mongoose from 'mongoose'

// Holds information about allowed users of the web app
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
})

const User = mongoose.model('User', UserSchema, 'users')

export default User
