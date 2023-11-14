import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import dotenv from 'dotenv'

dotenv.config()

// AWS S3 configuration
const client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  }
})

class PhotoController {
  // Send photo to AWS S3
  uploadPhoto = async (req, res) => {
    try {
      // body-parser will automatically read image data into the body
      const data = req.body

      // Passed through headers so raw data can go to body
      const filename = req.headers['x-timestamp'] + '.jpeg'

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filename,
        Body: data,
        ContentType: 'image/jpeg'
      })

      await client.send(command)

      res.status(200).json({
        message: 'Image uploaded successfully'
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  // Retrieve signed URL from AWS S3
  getPhotoUrl = async (req, res) => {
    try {
      const timestamp = req.params.timestamp

      // Key will search for the filename
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${timestamp}.jpeg`
      })

      // URL will expire in 3600 seconds (1 hour)
      const url = await getSignedUrl(client, command, { expiresIn: 3600 })

      res.status(200).send(url)
    } catch (err) {
      console.error(err)
      if (err.name === 'NoSuchKey') {
        res.status(404).json({ message: 'Photo not found' })
      } else {
        res.status(500).json({ message: 'Internal Server Error' })
      }
    }
  }
}

export default PhotoController
