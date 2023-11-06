import CellArea from '../models/cellAreaModel.js'

class CellAreaController {
  // Retrieving most recent sensor data
  getCellArea = async (req, res) => {
    try {
      const cellId = req.params.cellId
      const cell = await CellArea.findOne({ cellId: cellId })

      res.status(200).json(cell.area)
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}

export default CellAreaController
