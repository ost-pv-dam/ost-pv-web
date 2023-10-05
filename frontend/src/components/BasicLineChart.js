import React from 'react'
import { LineChart } from '@mui/x-charts/LineChart'

function BasicLineChart() {
  return (
    <LineChart
      xAxis={[
        { label: 'dataXAxis', position: 'top', data: [1, 2, 3, 5, 8, 10] }
      ]}
      series={[
        {
          curve: 'catmullRom',
          data: [2, 5.5, 2, 8.5, 1.5, 5]
        }
      ]}
      width={500}
      height={300}
    />
  )
}

export default BasicLineChart
