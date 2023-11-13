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
  uploadPhoto = async (req, res) => {
    try {
      const data = req.body
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

  getPhotoUrl = async (req, res) => {
    try {
      const timestamp = req.params.timestamp

      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${timestamp}.jpeg`
      })

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
