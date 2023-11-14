import axios from 'axios'

// Used for all API calls
const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'x-api-key': process.env.REACT_APP_API_KEY,
    'Content-Type': 'application/json'
  }
})

export default instance
