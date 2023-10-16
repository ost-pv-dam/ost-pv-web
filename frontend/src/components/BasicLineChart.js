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
  const formattedIvCurve = ivCurve.map((iv) => {
    return {
      voltage: iv.voltage['$numberDecimal'],
      currentDensity: iv.current['$numberDecimal']
    }
  })
  formattedIvCurve.sort((a, b) => a.voltage - b.voltage)

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
      <LineChart data={formattedIvCurve}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="voltage"
          type="number"
          label={{ value: 'Voltage (V)', position: 'bottom', offset: -8 }}
          tickCount={11}
          domain={[-5, 5]}
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
