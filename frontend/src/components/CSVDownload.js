import React, { useState } from 'react'
import { Col, Card, Row, DatePicker, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

function CSVDownload() {
  // State variables for start and end dates
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  // Function to handle date selection
  const handleStartDateChange = (date) => {
    setStartDate(date)
  }

  const handleEndDateChange = (date) => {
    setEndDate(date)
  }

  return (
    <Col span={6}>
      <Card title="Download raw data" style={{ textAlign: 'center' }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <DatePicker
              value={startDate}
              onChange={handleStartDateChange}
              placeholder="Start Date"
            />
          </Col>
          <Col span={12}>
            <DatePicker
              value={endDate}
              onChange={handleEndDateChange}
              placeholder="End Date"
            />
          </Col>
          <Col span={24}>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              disabled={!startDate || !endDate}
            >
              Download CSV
            </Button>
          </Col>
        </Row>
      </Card>
    </Col>
  )
}

export default CSVDownload
