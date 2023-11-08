import React from 'react'
import { Row, Col, Statistic, Card } from 'antd'
import BasicLineChart from './BasicLineChart'
import CSVDownload from './CSVDownload'

const ModuleData = ({ cellData, timestamp }) => {
  const cellTitle = `Module ${cellData?.cellId - 1 || 'Not Found'}`

  return (
    <Col span={12}>
      <Card
        title={cellTitle}
        extra={
          cellData ? (
            <CSVDownload
              ivCurve={cellData.ivCurve}
              filename={'module_' + cellData.cellId - 1 + '_' + timestamp}
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
              <Card>
                <Statistic title="Pmax" value="40.3" suffix="mW" />
              </Card>
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
