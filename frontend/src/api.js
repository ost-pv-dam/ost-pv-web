import axios from 'axios'
const instance = axios.create({
  baseURL: 'http://localhost:5050',
  headers: {
    'x-api-key': 'd3e56f87-141b-4cd6-ba43-16aca37d06bc',
    'Content-Type': 'application/json' // Set content type as needed
  }
})

export default instance
