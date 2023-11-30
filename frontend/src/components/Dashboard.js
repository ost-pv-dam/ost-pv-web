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
  message,
  Image,
  Spin
} from 'antd'
import BasicLineChart from './BasicLineChart'
import ModuleData from './ModuleData'
import JSONDownload from './JSONDownload'
import instance from '../api'
import CSVDownload from './CSVDownload'
import PMaxStatistic from './PMaxStatistic'

const { Title, Text } = Typography

// Home page of the website
function Dashboard({ user }) {
  const [data, setData] = useState(null)
  const [isMostRecent, setIsMostRecent] = useState(true)
  const [mostRecentOid, setMostRecentOid] = useState(null)
  const [secondMostRecentOid, setSecondMostRecentOid] = useState(null)
  const [photoURL, setPhotoURL] = useState(null)

  // Needed for poll now message
  const [messageApi, contextHolder] = message.useMessage()

  // Retrieves all of the data for each transmission (most recent, next, prev, etc. buttons)
  const fetchData = async (endpoint, isSecondMostRecent = false) => {
    try {
      // Make the API call to get the sensorCellData
      const response = await instance.get(endpoint)
      // Set the state
      setData(response.data)
      // Separate API call to AWS S3 in search of the corresponding photo
      fetchPhotoURL(new Date(response.data.timestamp).getTime() / 1000)

      // If the endpoint is searching for the most recent data, set
      // the most recent state
      if (endpoint === '/api/v1/sensorCellData') {
        setMostRecentOid(response.data._id)
      } else if (isSecondMostRecent) {
        // If the data is the second most recent, set that state. This is used
        // for disabling the "next" button when user navigates from most recent,
        // to previous, to next. The button won't automatically disable because
        // '/api/v1/sensorCellData' wasn't called, '/api/v1/sensorCellData/next' was.
        setSecondMostRecentOid(response.data._id)
      }
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }

  // Set the photoURL state. AWS S3 will return a URL whether the photo
  // was found or not
  const fetchPhotoURL = async (timestamp) => {
    const photoURL = await instance.get(
      '/api/v1/sensorCellData/getPhoto/' + timestamp
    )
    setPhotoURL(photoURL.data)
  }

  // Format the date for "Transmission Time" field
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)

    // Options for data.toLocaleString
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
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

  // Automatically get most recent data on page load
  useEffect(() => {
    fetchData('/api/v1/sensorCellData')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleNextClick = () => {
    if (!isMostRecent && data) {
      // Ensure that "next" is disabled
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
        // Pass through true so we set secondMostRecent state
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
      // Reload automatically on delete
      window.location.reload()
    }
  }

  const handlePollNowClick = async () => {
    // Try to acquire lock
    const response = await instance.post('/api/v1/sensorCellData/pollNow')

    if (response.data.type === 'loading') {
      // Lock was acquired, hold message open indefinitely
      messageApi.open({
        type: response.data.type,
        content: response.data.content,
        duration: 0
      })

      // This function will eventually close the message
      checkPollNowLock()
    } else {
      // Lock was not acquired, display message for 4 seconds
      messageApi.open({
        type: response.data.type,
        content: response.data.content,
        duration: 4
      })
    }
  }

  const checkPollNowLock = async () => {
    // Check status of the lock
    const isLocked = await instance.get('/api/v1/sensorCellData/isLocked')

    // If it's still locked, wait another 10 seconds then check again
    if (isLocked.data) {
      setTimeout(checkPollNowLock, 10000)
    } else {
      // Otherwise, get rid of the message and reload the page (with new data hopefully)
      message.destroy()
      window.location.reload()
    }
  }

  const handleTimeChange = (timestamp) => {
    // Create date from user-selected timestamp, get nearest data to that
    const d = new Date(timestamp)
    setIsMostRecent(false)
    fetchData('/api/v1/sensorCellData/nearestTransmission/' + d.toISOString())
  }

  // Handle states of user where we don't want to show them the page
  if (user === 'signed_out') {
    return (
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title>Welcome to the UMich ST-OPV Data Acquisition Module!</Title>
        </Col>
        <Col span={24}>
          <Title level={3}>
            Please sign in on the left to view the dashboard.
          </Title>
        </Col>
      </Row>
    )
  }

  if (user === 'unauthorized') {
    return (
      <Title level={3}>
        Unauthorized user, please sign in with a different account
      </Title>
    )
  }

  return (
    <div>
      {contextHolder}
      {user && data && photoURL ? (
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col>
            <Card bordered={false}>
              <Title>ST-OPV Dashboard</Title>
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
          <Col span={12}>
            <Card bordered={false} title="Module Viewer">
              <Row gutter={[16, 16]} justify="center">
                <Col>
                  <Image height={480} src={photoURL} fallback="no-image.jpeg" />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={12}>
            {data.cells[0] ? (
              <Card
                title="ST-OPV Module"
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
                    <PMaxStatistic pMax={data.cells[0].pMax} />
                  </Col>
                  <Col span={12}>
                    {data.cells[0].surfaceTemperature > -20 ? (
                      <Card>
                        <Statistic
                          title="Cell Temperature"
                          value={data.cells[0].surfaceTemperature}
                          suffix="°F"
                          precision={2}
                        />
                      </Card>
                    ) : (
                      <div></div>
                    )}
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
            cellTitle="Forward Diode"
          />
          <ModuleData
            cellData={data.cells[2] ? data.cells[2] : null}
            timestamp={data.timestamp}
            cellTitle="Backward Diode"
          />
          <ModuleData
            cellData={data.cells[3] ? data.cells[3] : null}
            timestamp={data.timestamp}
            cellTitle="4.7k Resistor"
          />
          <ModuleData
            cellData={data.cells[4] ? data.cells[4] : null}
            timestamp={data.timestamp}
            cellTitle="10k Resistor"
          />
          <Col xl={9} s={0} />
          <JSONDownload />
          <Col xl={9} s={0} />
        </Row>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '25vh'
          }}
        >
          <Spin size="large" />
        </div>
      )}
    </div>
  )
}

export default Dashboard
