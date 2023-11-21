import User from '../models/userModel.js'

class UserController {
  // Return whether an email shows up in the user collection
  isAuthorizedUser = async (req, res) => {
    try {
      const email = req.params.email

      const user = await User.findOne({ email: email })

      res.status(200).send(user ? true : false)
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}

export default UserController
