import React from 'react'
import { Row, Col, Statistic, Card } from 'antd'
import BasicLineChart from './BasicLineChart'

const ModuleData = ({ data }) => {
  const cellTitle = `Cell ${data?.moduleId || '0'}`
  return (
    <Col span={12}>
      <Card title={cellTitle}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <BasicLineChart />
          </Col>
          <Col span={12}>
            <Card>
              <Statistic title="Pmax" value="40.3" suffix="mW" />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Statistic title="Cell Temperature" value="56.4" suffix="°F" />
            </Card>
          </Col>
        </Row>
      </Card>
    </Col>
  )
}
export default ModuleData
