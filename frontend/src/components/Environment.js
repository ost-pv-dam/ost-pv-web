import React from 'react'
import BasicLineChart from './BasicLineChart'
import { Row, Col, Card, Statistic } from 'antd'

function Environment() {
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Environment Data">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card>
                  <Statistic
                    title="Ambient temperature"
                    value="87.5"
                    suffix="°F"
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Statistic title="Humidity" value="32.4" suffix="%" />
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Statistic
                    title="Barometric Pressure"
                    value="50.42"
                    suffix="P"
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Reference Module">
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
                  <Statistic
                    title="Light Intensity"
                    value="80.64"
                    suffix="mW"
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Environment
