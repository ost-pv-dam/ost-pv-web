import React, { useState, useEffect } from 'react'
import { Typography, Row, Col, Statistic, Card, Button, Space } from 'antd'
import BasicLineChart from './BasicLineChart'
import ModuleData from './ModuleData'
import JSONDownload from './JSONDownload'
import instance from '../api'

const { Title } = Typography

function Dashboard({ user }) {
  const [data, setData] = useState(null)
  const [isMostRecent, setIsMostRecent] = useState(true)
  const [mostRecentOid, setMostRecentOid] = useState(null)
  const [secondMostRecentOid, setSecondMostRecentOid] = useState(null)

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
    const day = date.getDate()
    const month = date.getMonth() + 1 // Month is zero-indexed, so add 1 to get the correct month.
    const year = date.getFullYear()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const formattedDay = day < 10 ? `0${day}` : day
    const formattedMonth = month < 10 ? `0${month}` : month
    const formattedHour = hour < 10 ? `0${hour}` : hour
    const formattedMinute = minute < 10 ? `0${minute}` : minute

    return `${formattedMonth}/${formattedDay}/${year} @ ${formattedHour}:${formattedMinute}`
  }

  useEffect(() => {
    fetchData('/api/v1/sensorCellData')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // useEffect(() => {
  //   if (!data || data._id === mostRecentOid) {
  //     console.log('1')
  //     setIsMostRecent(true)
  //   } else {
  //     console.log('2')
  //     setIsMostRecent(false)
  //   }
  // }, [mostRecentOid, data])

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

  return (
    <div
      style={{
        padding: 24
      }}
    >
      {user && data ? (
        <Row gutter={[16, 16]}>
          <Col span={10}>
            <Space>
              <Button type="primary" onClick={handlePreviousClick}>
                Previous
              </Button>
              <Button
                type="primary"
                onClick={handleNextClick}
                disabled={isMostRecent}
              >
                Next
              </Button>
              <Button
                type="primary"
                onClick={handleMostRecentClick}
                disabled={isMostRecent}
              >
                Most Recent
              </Button>
            </Space>
            <Title>OST-PV Data Acquisition Module</Title>
          </Col>
          <Col span={14}>
            <Card>
              <Row gutter={[16, 16]}>
                <Col span={5}>
                  <Card>
                    <Statistic
                      title="Ambient temp"
                      value={data.temperature['$numberDecimal']}
                      precision={2}
                      suffix="°F"
                    />
                  </Card>
                </Col>

                <Col span={5}>
                  <Card>
                    <Statistic
                      title="Humidity"
                      value={data.humidity['$numberDecimal']}
                      precision={2}
                      suffix="%"
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Pressure"
                      value={data.pressure['$numberDecimal']}
                      precision={2}
                      suffix="P"
                    />
                  </Card>
                </Col>
                <Col span={7}>
                  <Statistic
                    title="Transmission time"
                    value={formatDate(data.timestamp)}
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
                      value={data.lightIntensity['$numberDecimal']}
                      precision={2}
                      suffix="mW"
                    />
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
          <ModuleData cellData={data.cells[0]} />
          {/* <ModuleData cellData={data.cells[2]} />
          <ModuleData cellData={data.cells[3]} /> */}
          {/* <ModuleData cellData={data.cells[4]} /> */}
          <Col span={9} />
          <JSONDownload />
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
