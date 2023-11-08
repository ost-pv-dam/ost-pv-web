import React, { useState } from 'react'
import { Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import csvDownload from 'json-to-csv-export'

function CSVDownload({ ivCurve, filename }) {
  const [buttonDisabled, setButtonDisabled] = useState(false)

  return (
    <Button
      type="primary"
      icon={<DownloadOutlined />}
      disabled={buttonDisabled}
      onClick={() => {
        setButtonDisabled(true)
        csvDownload({ data: ivCurve, filename: filename })
        setButtonDisabled(false)
      }}
    />
  )
}

export default CSVDownload
