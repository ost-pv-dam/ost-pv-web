import React, { useState, useEffect } from 'react'
import {
  Typography,
  Row,
  Col,
  Statistic,
  Card,
  Button,
  Popconfirm,
  DatePicker,
  message
} from 'antd'
import BasicLineChart from './BasicLineChart'
import ModuleData from './ModuleData'
import JSONDownload from './JSONDownload'
import instance from '../api'
import CSVDownload from './CSVDownload'

const { Title, Text } = Typography

function Dashboard({ user }) {
  const [data, setData] = useState(null)
  const [isMostRecent, setIsMostRecent] = useState(true)
  const [mostRecentOid, setMostRecentOid] = useState(null)
  const [secondMostRecentOid, setSecondMostRecentOid] = useState(null)

  const [messageApi, contextHolder] = message.useMessage()

  const fetchData = async (endpoint, isSecondMostRecent = false) => {
    try {
      const response = await instance.get(endpoint)
      setData(response.data)
      if (endpoint === '/api/v1/sensorCellData') {
        setMostRecentOid(response.data._id)
      } else if (isSecondMostRecent) {
        setSecondMostRecentOid(response.data._id)
      }
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }

    const formattedDate = date.toLocaleString('en-US', options)

    // Split the formatted date to separate date and time
    const [formattedDatePart, formattedTimePart] = formattedDate.split(',')

    return `${formattedDatePart} @ ${formattedTimePart}`
  }

  useEffect(() => {
    fetchData('/api/v1/sensorCellData')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleNextClick = () => {
    if (!isMostRecent && data) {
      if (data._id === secondMostRecentOid) {
        setIsMostRecent(true)
      }

      fetchData(`/api/v1/sensorCellData/next/${data.timestamp}`)
    }
  }

  const handlePreviousClick = () => {
    if (data) {
      if (data._id === mostRecentOid) {
        setIsMostRecent(false)
        fetchData(`/api/v1/sensorCellData/prev/${data.timestamp}`, true)
      } else {
        fetchData(`/api/v1/sensorCellData/prev/${data.timestamp}`)
      }
    }
  }

  const handleMostRecentClick = () => {
    if (!isMostRecent && data) {
      setIsMostRecent(true)
      fetchData('/api/v1/sensorCellData')
    }
  }

  const handleDeleteClick = async () => {
    if (data) {
      await instance.delete('/api/v1/sensorCellData/' + data._id)
      window.location.reload()
    }
  }

  const handlePollNowClick = async () => {
    const response = await instance.post('/api/v1/sensorCellData/pollNow')

    if (response.data.type === 'loading') {
      messageApi.open({
        type: response.data.type,
        content: response.data.content,
        duration: 0
      })

      checkPollNowLock()
    } else {
      messageApi.open({
        type: response.data.type,
        content: response.data.content,
        duration: 4
      })
    }
  }

  const checkPollNowLock = async () => {
    const isLocked = await instance.get('/api/v1/sensorCellData/isLocked')

    if (isLocked.data) {
      setTimeout(checkPollNowLock, 10000)
    } else {
      message.destroy()
      window.location.reload()
    }
  }

  const handleTimeChange = (timestamp) => {
    const d = new Date(timestamp)
    setIsMostRecent(false)
    fetchData('/api/v1/sensorCellData/nearestTransmission/' + d.toISOString())
  }

  return (
    <div>
      {contextHolder}
      {user && data ? (
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col>
            <Card bordered={false}>
              <Title>OST-PV Dashboard</Title>
            </Card>
          </Col>
          <Col>
            <Card
              bordered={false}
              extra={
                <Row gutter={[8, 8]} align="middle">
                  <Col>
                    <Button type="primary" onClick={handlePreviousClick}>
                      Previous
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      onClick={handleNextClick}
                      disabled={isMostRecent}
                    >
                      Next
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      onClick={handleMostRecentClick}
                      disabled={isMostRecent}
                    >
                      Most Recent
                    </Button>
                  </Col>
                  <Col>
                    <DatePicker
                      showTime={{
                        format: 'HH:mm'
                      }}
                      showNow={false}
                      format="MM-DD-YYYY @ HH:mm"
                      onOk={handleTimeChange}
                      placeholder="Find nearest"
                    />
                  </Col>
                  <Col>
                    <Popconfirm
                      title="Delete current transmission"
                      description="Are you sure you want to delete this transmission?"
                      onConfirm={handleDeleteClick}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="primary" danger>
                        Delete Transmission
                      </Button>
                    </Popconfirm>
                  </Col>
                  <Col>
                    <Button type="default" onClick={handlePollNowClick}>
                      Poll Now
                    </Button>
                  </Col>
                </Row>
              }
            >
              <Row gutter={[16, 16]} justify="space-between" align="middle">
                <Col>
                  <Card type="inner">
                    <Text strong>
                      <Statistic
                        title="Transmission Time"
                        value={formatDate(data.timestamp)}
                      />
                    </Text>
                  </Card>
                </Col>
                <Col>
                  <Card type="inner">
                    <Statistic
                      title="Ambient temp"
                      value={data.temperature}
                      precision={2}
                      suffix="°F"
                    />
                  </Card>
                </Col>
                <Col>
                  <Card type="inner">
                    <Statistic
                      title="Humidity"
                      value={data.humidity}
                      precision={2}
                      suffix="%"
                    />
                  </Card>
                </Col>
                <Col>
                  <Card type="inner">
                    <Statistic
                      title="Pressure"
                      value={data.pressure}
                      precision={2}
                      suffix="P"
                    />
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            {data.cells[0] ? (
              <Card
                title="Reference Module"
                extra={
                  <CSVDownload
                    ivCurve={data.cells[0].ivCurve}
                    filename={'reference_module_' + data.timestamp}
                  />
                }
                bordered={false}
              >
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <BasicLineChart ivCurve={data.cells[0].ivCurve} />
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
                        value={data.lightIntensity}
                        precision={2}
                        suffix="mW"
                      />
                    </Card>
                  </Col>
                </Row>
              </Card>
            ) : (
              <Card title="Reference Module Not Found" bordered={false}></Card>
            )}
          </Col>
          <ModuleData
            cellData={data.cells[1] ? data.cells[1] : null}
            timestamp={data.timestamp}
          />
          <ModuleData
            cellData={data.cells[2] ? data.cells[2] : null}
            timestamp={data.timestamp}
          />
          <ModuleData
            cellData={data.cells[3] ? data.cells[3] : null}
            timestamp={data.timestamp}
          />
          <ModuleData
            cellData={data.cells[4] ? data.cells[4] : null}
            timestamp={data.timestamp}
          />
          <Col xl={9} s={0} />
          <JSONDownload />
          <Col xl={9} s={0} />
        </Row>
      ) : (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title>Welcome to the OST-PV Data Acquisition Module!</Title>
          </Col>
          <Col span={24}>
            <Title level={3}>
              Please sign in on the left to view the data.
            </Title>
          </Col>
        </Row>
      )}
    </div>
  )
}

export default Dashboard
