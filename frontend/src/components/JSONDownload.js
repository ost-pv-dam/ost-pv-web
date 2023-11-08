import React, { useState } from 'react'
import { Col, Card, Row, DatePicker, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import instance from '../api'

function JSONDownload() {
  // State variables for start and end dates
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [buttonDisabled, setButtonDisabled] = useState(false)

  // Functions to handle date selection
  const handleStartDateChange = (date) => {
    setStartDate(date)
  }

  const handleEndDateChange = (date) => {
    setEndDate(date)
  }

  const handleDownloadJSON = async () => {
    if (!startDate || !endDate) {
      return
    }

    setButtonDisabled(true)

    try {
      const response = await instance.get(
        '/api/v1/sensorCellData/period/' +
          startDate.toISOString().split('T')[0] +
          '/' +
          endDate.toISOString().split('T')[0] +
          '/'
      )

      // Create a Blob containing the JSON data
      const jsonBlob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: 'application/json'
      })

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(jsonBlob)

      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a')
      a.href = url
      a.download =
        'ost-pv-dam_' +
        startDate.toISOString().split('T')[0] +
        '_' +
        endDate.toISOString().split('T')[0] +
        '.json'

      // Programmatically click the anchor to trigger the download
      a.click()

      // Clean up by revoking the URL
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading CSV:', error)
    }

    setButtonDisabled(false)
  }

  return (
    <Col span={6}>
      <Card
        title="Download raw data"
        style={{ textAlign: 'center' }}
        bordered={false}
      >
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
              disabled={!startDate || !endDate || buttonDisabled}
              onClick={handleDownloadJSON}
            >
              Download JSON
            </Button>
          </Col>
        </Row>
      </Card>
    </Col>
  )
}

export default JSONDownload
