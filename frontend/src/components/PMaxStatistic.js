import React from 'react'
import { Card, Statistic } from 'antd'

function PMaxStatistic({ pMax }) {
  return (
    <Card>
      {pMax?.value ? (
        <Statistic
          title="Max Power"
          value={pMax.value * 1000}
          suffix="mW"
          precision={2}
        />
      ) : (
        <Statistic title="Max Power" value="Not Found" />
      )}
    </Card>
  )
}

export default PMaxStatistic
