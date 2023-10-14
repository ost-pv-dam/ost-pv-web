import React from 'react'
import { Typography, Row, Col, Statistic, Card, Button, Space } from 'antd'
import BasicLineChart from './BasicLineChart'
import ModuleData from './ModuleData'
import CSVDownload from './CSVDownload'

const { Title } = Typography

function Dashboard({ user }) {
  return (
    <div
      style={{
        padding: 24
      }}
    >
      {user ? (
        <Row gutter={[16, 16]}>
          <Col span={10}>
            <Space>
              <Button type="primary">Previous</Button>
              <Button type="primary">Next</Button>
            </Space>
            <Title>OST-PV Data Acquisition Module</Title>
          </Col>
          <Col span={14}>
            <Card>
              <Row gutter={[16, 16]}>
                <Col span={5}>
                  <Card>
                    <Statistic title="Ambient temp" value="87.5" suffix="°F" />
                  </Card>
                </Col>

                <Col span={5}>
                  <Card>
                    <Statistic title="Humidity" value="32.4" suffix="%" />
                  </Card>
                </Col>
                <Col span={5}>
                  <Card>
                    <Statistic title="Pressure" value="50.42" suffix="P" />
                  </Card>
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Transmission time"
                    value={'Sun, Oct 8 @ 12:00pm'}
                    style={{
                      textAlign: 'right'
                    }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={24}>
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
          <ModuleData data={{ moduleId: 1 }} />
          <ModuleData data={{ moduleId: 2 }} />
          <ModuleData data={{ moduleId: 3 }} />
          <ModuleData data={{ moduleId: 4 }} />
          <Col span={9} />
          <CSVDownload />
          <Col span={9} />
        </Row>
      ) : (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title>Welcome to the OST-PV Data Acquisition Module!</Title>
          </Col>
          <Col span={24}>
            <Title level={3}>Please sign in to view the data.</Title>
          </Col>
        </Row>
      )}
    </div>
  )
}

export default Dashboard
