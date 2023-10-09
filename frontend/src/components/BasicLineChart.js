import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

function BasicLineChart() {
  const data = [
    {
      voltage: 0,
      currentDensity: 3.2
    },
    {
      voltage: 2,
      currentDensity: 5.3
    },
    {
      voltage: 3,
      currentDensity: 8.7
    },
    {
      voltage: 4,
      currentDensity: 8.1
    },
    {
      voltage: 5,
      currentDensity: 7.7
    },
    {
      voltage: 6,
      currentDensity: 2.1
    },
    {
      voltage: 8,
      currentDensity: 7.5
    }
  ]

  const lineChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p>{`voltage: ${label}`}</p>
          <p>{`current density: ${payload[0].value}`}</p>
        </div>
      )
    }

    return null
  }

  return (
    <ResponsiveContainer width="95%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="voltage"
          type="number"
          label={{ value: 'Voltage (V)', position: 'bottom', offset: -8 }}
        />
        <YAxis
          label={{
            value: 'Current Density',
            angle: -90
          }}
        />
        <Tooltip content={lineChartTooltip} />
        <Line
          type="monotone"
          dataKey="currentDensity"
          stroke="#00008b"
          strokeWidth={3}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default BasicLineChart
