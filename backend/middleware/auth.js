export const authenticateAPIKey = async (req, res, next) => {
  const key = req.header('x-api-key')
  const apiKey = process.env.API_KEY

  if (!key || key !== apiKey) {
    return res
      .status(401)
      .json({ message: 'Authentication failed: Invalid API key' })
  }

  next()
}
