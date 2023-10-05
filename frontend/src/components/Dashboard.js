import React from 'react'
import { Typography } from '@mui/material'
import { Line } from '@nivo/line'

function Dashboard({ data }) {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Data Visualization
      </Typography>
      <div style={{ height: '400px' }}>
        <Line
          width={800}
          height={400}
          data={data}
          xScale={{ type: 'time', format: '%Y-%m-%d', precision: 'day' }}
          xFormat="time:%Y-%m-%d"
          margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
          axisLeft={{
            legend: 'Value',
            legendPosition: 'middle',
            legendOffset: -40
          }}
        />
      </div>
    </div>
  )
}

export default Dashboard
