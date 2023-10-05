import React from 'react'
import { Typography } from '@mui/material'
import BasicLineChart from './BasicLineChart'

function Home({ user }) {
  return (
    <div>
      <Typography variant="h2" gutterBottom>
        Welcome to your IoT Dashboard
      </Typography>
      {user ? (
        <div>
          <Typography variant="h3" gutterBottom>
            Data Visualization
          </Typography>
          <div>
            <BasicLineChart />
          </div>
        </div>
      ) : (
        <Typography variant="body1" gutterBottom>
          Please sign in to view the data.
        </Typography>
      )}
    </div>
  )
}

export default Home
