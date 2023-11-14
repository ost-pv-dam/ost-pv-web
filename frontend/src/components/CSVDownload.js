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
        // Disable the button while data is being downloaded
        setButtonDisabled(true)
        csvDownload({ data: ivCurve, filename: filename, delimiter: ',' })
        setButtonDisabled(false)
      }}
    />
  )
}

export default CSVDownload
