import React, { useState } from 'react'
import { Col, Card, Row, DatePicker, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import instance from '../api'

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

  const handleDownloadCSV = async () => {
    if (!startDate || !endDate) {
      return
    }

    try {
      const response = await instance.get(
        '/api/v1/sensorCellData/' + startDate + '/' + endDate + '/'
      )
    } catch (error) {
      console.error('Error downloading CSV:', error)
    }
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
              onClick={handleDownloadCSV}
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
