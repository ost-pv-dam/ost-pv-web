import React from 'react'
import { Card, Statistic, Popover } from 'antd'

function PMaxStatistic({ pMax }) {
  return (
    <div>
      {pMax?.value ? (
        <Popover
          content={
            <div>
              <p>Voltage: {pMax.pair.voltage}V</p>
              <p>Current: {pMax.pair.current}A</p>
            </div>
          }
          title="Max Power Pair"
        >
          <Card hoverable={true}>
            <Statistic
              title="Max Power"
              value={pMax.value * 1000}
              suffix="mW"
              precision={2}
            />
          </Card>
        </Popover>
      ) : (
        <Card>
          <Statistic title="Max Power" value="Not Found" />
        </Card>
      )}
    </div>
  )
}

export default PMaxStatistic
