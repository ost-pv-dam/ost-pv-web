import React from 'react'
import { Row, Col, Statistic, Card } from 'antd'
import BasicLineChart from './BasicLineChart'
import CSVDownload from './CSVDownload'
import PMaxStatistic from './PMaxStatistic'

// 4 cards of module data
const ModuleData = ({ cellData, timestamp }) => {
  // Check for cellId or display that it's not found
  const cellTitle = `Module ${cellData?.cellId || 'Not Found'}`

  return (
    <Col span={12}>
      <Card
        title={cellTitle}
        extra={
          cellData ? (
            <CSVDownload
              ivCurve={cellData.ivCurve}
              filename={'module_' + cellData.cellId + '_' + timestamp}
            />
          ) : (
            <div></div>
          )
        }
        bordered={false}
      >
        {cellData ? (
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <BasicLineChart ivCurve={cellData.ivCurve} />
            </Col>
            <Col span={12}>
              <PMaxStatistic pMax={cellData.pMax} />
            </Col>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Cell Temperature"
                  value={cellData.surfaceTemperature}
                  suffix="°F"
                />
              </Card>
            </Col>
          </Row>
        ) : (
          <div></div>
        )}
      </Card>
    </Col>
  )
}
export default ModuleData
