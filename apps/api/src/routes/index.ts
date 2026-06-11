import { Router } from 'express'
import { uploadRouter } from './upload'
import { processRouter } from './process'
import { gridRouter } from './grid'
import { previewRouter } from './preview'

const router = Router()

router.use('/upload', uploadRouter)
router.use('/process', processRouter)
router.use('/grid', gridRouter)
router.use('/preview', previewRouter)

export { router as routes }
