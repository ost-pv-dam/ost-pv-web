import mongoose from 'mongoose'

// Define what should be in each collection. We will create one of these
// models for each type of data we collect.
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
})

// Tell mongoose the name of the model, the schema, and name of the collection
const User = mongoose.model('User', UserSchema, 'users')

export default User
