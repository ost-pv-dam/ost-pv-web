import app from './server.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Load environment variables from .env
dotenv.config()

const port = process.env.PORT || 8000

// index.js is akin to main.c, the program starts here
const connect = async () => {
  try {
    await mongoose.connect(process.env.OST_PV_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('connected to db')

    // "app" comes from server.js, calling listen will open up all of the endpoints that we define there
    app.listen(port, () => {
      console.log(`listening on port ${port}`)
    })
  } catch (err) {
    console.error(err.message)

    process.exit(1)
  }
}

connect()
