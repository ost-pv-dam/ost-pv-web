import React from 'react'
import { Row, Col, Statistic, Card } from 'antd'
import BasicLineChart from './BasicLineChart'

const ModuleData = ({ cellData }) => {
  const cellTitle = `Cell ${cellData?.cellId - 1 || 'Not Found'}`

  return (
    <Col span={12}>
      <Card title={cellTitle}>
        {cellData ? (
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <BasicLineChart ivCurve={cellData.ivCurve} />
            </Col>
            <Col span={12}>
              <Card>
                <Statistic title="Pmax" value="40.3" suffix="mW" />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Cell Temperature"
                  value={cellData.surfaceTemperature['$numberDecimal']}
                  suffix="°F"
                />
              </Card>
            </Col>
          </Row>
        ) : (
          <div></div>
        )}
      </Card>
    </Col>
  )
}
export default ModuleData
