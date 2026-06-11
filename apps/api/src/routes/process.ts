import { Router } from 'express'
import { processImage } from '../services/imageService'

const router: Router = Router()

router.post('/:filterType', async (req, res) => {
  try {
    const { filterType } = req.params
    const { imageId, parameters } = req.body

    if (!imageId || !parameters) {
      return res.status(400).json({
        error: { message: 'Missing imageId or parameters', code: 'MISSING_PARAMS' }
      })
    }

    const result = await processImage(imageId, filterType, parameters)
    res.json({
      success: true,
      imageId: result.imageId,
      filterType: result.filterType,
      processedImageUrl: result.processedImageUrl,
    })
  } catch (error) {
    res.status(500).json({
      error: { message: 'Error processing image', code: 'PROCESS_ERROR' }
    })
  }
})

export { router as processRouter }
