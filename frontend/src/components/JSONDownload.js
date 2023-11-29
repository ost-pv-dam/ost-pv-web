import React, { useState } from 'react'
import { Col, Card, Row, DatePicker, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import instance from '../api'

const { RangePicker } = DatePicker

// JSON download card
function JSONDownload() {
  // State variables for start and end dates
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [buttonDisabled, setButtonDisabled] = useState(false)

  // Handle range selection
  const handleRangeChange = (value, dateString) => {
    setStartDate(dateString[0])
    setEndDate(dateString[1])
  }
  const handleDownloadJSON = async () => {
    if (!startDate || !endDate) {
      return
    }

    setButtonDisabled(true)

    try {
      // Make API call to return the data
      const response = await instance.get(
        '/api/v1/sensorCellData/period/' + startDate + '/' + endDate + '/'
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
      a.download = 'st-opv-dam_' + startDate + '_' + endDate + '.json'

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
    <Col xl={6} s={24}>
      <Card
        title="Download Raw Data"
        style={{ textAlign: 'center' }}
        bordered={false}
      >
        <Row gutter={[16, 16]} justify="center">
          <Col>
            <RangePicker onChange={handleRangeChange} />
          </Col>
          <Col>
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
