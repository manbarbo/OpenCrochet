import { Router } from 'express'
import { uploadRouter } from './routes/upload'
import { processRouter } from './routes/process'

const router = Router()

router.use('/upload', uploadRouter)
router.use('/process', processRouter)

export { router as routes }
