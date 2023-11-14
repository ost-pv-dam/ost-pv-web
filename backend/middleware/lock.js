import Lock from '../models/lockModel.js'

// Attempt to acquire poll now lock
export const checkAndSetLock = async (req, res, next) => {
  try {
    // Use findOneAndUpdate for atomic operation
    const updatedLock = await Lock.findOneAndUpdate(
      { isLocked: false },
      { $set: { isLocked: true } },
      { new: true }
    )

    // If updatedLock is null, it means another request has already set the lock.
    // Still send back 200 status because website shouldn't crash, should just
    // display a message for the user.
    if (!updatedLock) {
      return res.status(200).json({
        type: 'warning',
        content:
          'Poll already in progress: please wait for new data before initiating another poll.'
      })
    }

    next()
  } catch (err) {
    console.error(err)
    res.status(500).json({ type: 'error', content: 'Internal Server Error' })
  }
}

export const unlock = async (req, res) => {
  try {
    await Lock.updateOne({}, { isLocked: false })

    // It doesn't matter if we try to unlock an already released lock.
    // This will happen frequently with the 15 minute automatic polling
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const isLocked = async (req, res) => {
  try {
    // Only one document in the collection
    const lock = await Lock.findOne({})

    res.status(200).send(lock.isLocked)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
