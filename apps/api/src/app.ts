import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { errorHandler } from './middleware/errorHandler'
import { routes } from './routes'

const app = express()

// Security middleware
app.use(helmet())
app.use(cors())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})
app.use('/api/', limiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// Routes
app.use('/api', routes)

// Error handling
app.use(errorHandler)

export { app }
