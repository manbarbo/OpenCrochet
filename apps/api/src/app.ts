import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import path from 'path'
import { errorHandler } from './middleware/errorHandler'
import { routes } from './routes'

const app: express.Application = express()

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

// Swagger UI
const swaggerDocument = YAML.load(path.join(__dirname, '../../../docs/api-spec.yaml'))
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Routes
app.use('/api', routes)

// Error handling
app.use(errorHandler)

export { app }
