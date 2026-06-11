import { Router } from 'express'
import { previewImage } from '../services/imageService'

const router: Router = Router()

router.post('/', async (req, res) => {
  try {
    const { imageId, filterType, parameters } = req.body

    if (!imageId || !filterType || !parameters) {
      return res.status(400).json({
        error: { message: 'Missing imageId, filterType, or parameters', code: 'MISSING_PARAMS' }
      })
    }

    const previewUrl = await previewImage(imageId, filterType, parameters)
    res.json({
      success: true,
      imageId,
      filterType,
      previewImageUrl: previewUrl,
    })
  } catch (error) {
    res.status(500).json({
      error: { message: 'Error previewing image', code: 'PREVIEW_ERROR' }
    })
  }
})

export { router as previewRouter }
