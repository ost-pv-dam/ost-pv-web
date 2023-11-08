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

function BasicLineChart({ ivCurve }) {
  const lineChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p>{`voltage: ${label}`}</p>
          <p>{`current: ${payload[0].value}`}</p>
        </div>
      )
    }

    return null
  }

  return (
    <ResponsiveContainer width="95%" height={350}>
      <LineChart data={ivCurve}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="voltage"
          type="number"
          label={{ value: 'Voltage (V)', position: 'bottom', dy: -15 }}
          tickCount={8}
          domain={[-1, 6]}
        />
        <YAxis
          label={{
            value: 'Current',
            angle: -90,
            dx: -30
          }}
          domain={[-0.001, 0.006]}
        />
        <Tooltip content={lineChartTooltip} />
        <Line
          type="monotone"
          dataKey="current"
          stroke="#00008b"
          strokeWidth={3}
          activeDot={{ r: 4 }}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default BasicLineChart
