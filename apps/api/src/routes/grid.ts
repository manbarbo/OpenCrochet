import { Router } from 'express'
import { generateGrid, exportPattern } from '../services/imageService'

const router = Router()

router.post('/generate', async (req, res) => {
  try {
    const { imageId, gridWidth, gridHeight } = req.body

    if (!imageId || !gridWidth || !gridHeight) {
      return res.status(400).json({
        error: { message: 'Missing imageId, gridWidth, or gridHeight', code: 'MISSING_PARAMS' }
      })
    }

    const grid = await generateGrid(imageId, gridWidth, gridHeight)
    res.json({
      success: true,
      grid,
      width: gridWidth,
      height: gridHeight,
    })
  } catch (error) {
    res.status(500).json({
      error: { message: 'Error generating grid', code: 'GRID_ERROR' }
    })
  }
})

router.post('/export', async (req, res) => {
  try {
    const { imageId, format, gridWidth, gridHeight } = req.body

    if (!imageId || !format || !gridWidth || !gridHeight) {
      return res.status(400).json({
        error: { message: 'Missing required parameters', code: 'MISSING_PARAMS' }
      })
    }

    const result = await exportPattern(imageId, format, gridWidth, gridHeight)
    
    if (format === 'svg') {
      res.setHeader('Content-Type', 'image/svg+xml')
      res.send(result)
    } else if (format === 'png') {
      res.setHeader('Content-Type', 'image/png')
      res.sendFile(result)
    } else {
      res.json({
        success: true,
        pattern: result,
      })
    }
  } catch (error) {
    res.status(500).json({
      error: { message: 'Error exporting pattern', code: 'EXPORT_ERROR' }
    })
  }
})

export { router as gridRouter }
