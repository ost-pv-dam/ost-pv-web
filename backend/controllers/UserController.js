import User from '../models/userModel.js'

class UserController {
  // Retrieve list of all allowed emails
  getUsers = async (req, res) => {
    try {
      const users = await User.find()

      const emails = users.map((user) => user.email)
      res.status(200).json(emails)
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}

export default UserController
