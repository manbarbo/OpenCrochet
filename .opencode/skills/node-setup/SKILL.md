---
name: node-setup
description: Initialize Node.js backend with Express, TypeScript, Sharp, Jest. Use when setting up the API server or creating new backend services.
---

# Node.js API Setup Skill

Use this skill when initializing or setting up the Node.js backend API for OpenCrochet.

## Trigger
- Initial API setup
- New backend service creation
- Backend rebuild or major reconfiguration

## Actions

### 1. Initialize Project
```bash
cd apps/api
pnpm init
```

### 2. Install Dependencies
```bash
# Core
pnpm add express@latest
pnpm add sharp@latest
pnpm add multer@latest

# Validation & Security
pnpm add joi@latest helmet@latest cors@latest
pnpm add express-rate-limit@latest

# Logging & Utils
pnpm add winston@latest dotenv@latest

# Dev Dependencies
pnpm add -D @types/express @types/multer @types/cors
pnpm add -D @types/node
pnpm add -D typescript ts-node nodemon
pnpm add -D jest @types/jest supertest @types/supertest
pnpm add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
pnpm add -D eslint prettier eslint-config-prettier
pnpm add -D husky lint-staged
```

### 3. Configure TypeScript
Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@controllers/*": ["src/controllers/*"],
      "@services/*": ["src/services/*"],
      "@routes/*": ["src/routes/*"],
      "@middleware/*": ["src/middleware/*"],
      "@models/*": ["src/models/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"],
      "@config/*": ["src/config/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### 4. Configure Express App
Create `src/app.ts`:
```typescript
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
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use('/api/', limiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Routes
app.use('/api', routes)

// Swagger docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Error handling
app.use(errorHandler)

export { app }
```

### 5. Configure Entry Point
Create `src/server.ts`:
```typescript
import dotenv from 'dotenv'
dotenv.config()

import { app } from './app'
import { logger } from './utils/logger'

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
```

### 6. Configure Winston Logger
Create `src/utils/logger.ts`:
```typescript
import winston from 'winston'

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'opencrochet-api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
})
```

### 7. Configure Error Handler
Create `src/middleware/errorHandler.ts`:
```typescript
import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.stack)

  res.status(500).json({
    error: {
      message: err.message || 'Internal Server Error',
      code: 'INTERNAL_ERROR',
      status: 500,
    },
  })
}
```

### 8. Configure Jest
Create `jest.config.js`:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts',
    '!src/server.ts',
  ],
}
```

### 9. Create Folder Structure
```
apps/api/src/
├── controllers/         # Route handlers
├── services/            # Business logic
├── routes/              # API route definitions
├── middleware/          # Express middleware
├── models/              # Data models (if DB needed)
├── utils/               # Helper functions
├── types/               # TypeScript types
├── config/              # Configuration
├── app.ts
├── server.ts
└── setupTests.ts
```

### 10. Configure Swagger/OpenAPI
Create `src/config/swagger.ts`:
```typescript
import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OpenCrochet API',
      version: '1.0.0',
      description: 'API for converting images into filet crochet patterns',
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)
```

## Requirements
- MUST use pnpm for all package operations
- MUST configure TypeScript strict mode
- MUST set up error handling middleware
- MUST configure environment variables with dotenv
- MUST set coverage threshold to 80%
- MUST configure Swagger/OpenAPI documentation
- MUST implement security middleware (Helmet, CORS, rate limit)
- MUST configure Winston logging

## Verification
Run these commands to verify setup:
```bash
pnpm lint          # ESLint check
pnpm test          # Jest tests
pnpm build         # TypeScript compilation
pnpm dev           # Nodemon server start
```

## Environment Variables
Create `.env.example`:
```
PORT=3001
NODE_ENV=development
LOG_LEVEL=info
UPLOAD_MAX_SIZE=10485760
UPLOAD_DIR=uploads
```
