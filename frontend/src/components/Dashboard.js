import React from 'react'
import { Typography, Row, Col, Statistic } from 'antd'
import Environment from './Environment'

const { Title } = Typography

function Dashboard({ user }) {
  return (
    <div
      style={{
        padding: 24
      }}
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Title>OST-PV Data Acquisition Module</Title>
        </Col>
        <Col span={12}>
          <Statistic
            title="Most recent transmission"
            value={'Sun, Oct 8 @ 12:00pm'}
            style={{
              textAlign: 'right'
            }}
          />
        </Col>
      </Row>

      {user ? (
        <div>
          <Environment />
        </div>
      ) : (
        <Title level={4}>Please sign in to view the data.</Title>
      )}
    </div>
  )
}

export default Dashboard
