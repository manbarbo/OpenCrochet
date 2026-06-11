# OpenCrochet Architecture

## Overview

OpenCrochet is a monorepo web application that converts images into filet crochet patterns using image processing techniques. The architecture follows a clean separation between frontend and backend, with shared packages for common functionality.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React 19   │  │   MUI v6     │  │   Zustand    │      │
│  │   (Vite)     │  │   (Theme)    │  │   (State)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/JSON
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway (Nginx)                    │
│                    (Reverse Proxy + SSL)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
┌─────────────────────────┐  ┌─────────────────────────────┐
│   Frontend (React)       │  │   Backend (Node.js)          │
│   Port: 3000            │  │   Port: 3001                │
│   - Static files        │  │   - Express API              │
│   - SPA routing         │  │   - Image processing          │
└─────────────────────────┘  │   - File upload (Multer)      │
                             │   - Sharp library             │
                             └─────────────────────────────┘
                                          │
                                          │
                             ┌────────────┴────────────┐
                             │                         │
                             ▼                         ▼
                    ┌──────────────┐         ┌────────────────┐
                    │   File System │         │   Processed    │
                    │   (uploads/)  │         │   Images       │
                    │   Temp storage│         │   (uploads/)   │
                    └──────────────┘         └────────────────┘
```

## Monorepo Structure

```
OpenCrochet/
├── apps/
│   ├── web/                    # React frontend application
│   │   ├── src/
│   │   │   ├── components/     # React components (ImageUploader, FilterPanel, etc.)
│   │   │   ├── services/       # API service layer (axios wrappers)
│   │   │   ├── stores/         # Zustand state management
│   │   │   ├── styles/         # MUI theme configuration
│   │   │   └── __tests__/      # E2E, a11y, cross-browser tests
│   │   ├── .storybook/          # Storybook configuration
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── jest.config.ts
│   │
│   └── api/                    # Node.js backend API
│       ├── src/
│       │   ├── routes/         # Express routes (upload, process, grid, preview)
│       │   ├── services/       # Business logic (imageService)
│       │   ├── middleware/     # Express middleware (errorHandler)
│       │   ├── utils/          # Utility functions (logger)
│       │   └── __tests__/      # Integration and performance tests
│       ├── uploads/            # Temporary file storage
│       ├── package.json
│       ├── tsconfig.json
│       └── jest.config.ts
│
├── packages/
│   ├── shared-types/           # Shared TypeScript interfaces
│   ├── image-processing/       # Shared image processing algorithms
│   └── ui-components/          # Shared MUI components
│
├── docs/                       # Documentation
│   ├── api-spec.yaml           # OpenAPI specification
│   ├── user-guide.md           # User documentation
│   └── architecture.md         # This file
│
├── terraform/                  # Infrastructure as Code
│   └── modules/               # S3, EC2, CloudFront
│
├── .opencode/                  # OpenCode configuration
│   ├── opencode.json          # Agent and command definitions
│   └── skills/                # Skill definitions
│
├── docker-compose.yml          # Local development orchestration
├── package.json               # Root workspace configuration
└── pnpm-workspace.yaml        # pnpm workspace definition
```

## Frontend Architecture

### Component Hierarchy

```
App
├── Stepper (3 steps: Upload → Filter → Grid)
├── Step 1: ImageUploader
│   ├── Drag & Drop Zone
│   ├── File Input
│   ├── Preview
│   └── Upload Button
├── Step 2: FilterPanel
│   ├── ImagePreview (Original + Processed)
│   ├── Filter Selector (ToggleButtonGroup)
│   ├── Filter Parameters (Sliders)
│   └── Apply Filter Button
└── Step 3: GridPreview
    ├── ImagePreview (Processed)
    ├── Grid Dimensions (Sliders)
    ├── Generate Grid Button
    ├── Grid Display (CSS Grid)
    └── Export Section (Format + Button)
```

### State Management

**Zustand Store** (`appStore.ts`):
- `uploadedImage`: string | null
- `processedImage`: string | null
- `currentFilter`: string | null
- `grid`: number[][] | null
- `error`: string | null

### Component Communication

- **Parent-Child**: Props (onUpload, imageId, etc.)
- **Cross-component**: Zustand store for shared state
- **API calls**: Services layer with axios/fetch

## Backend Architecture

### Request Flow

```
Client Request
    │
    ▼
┌─────────────┐
│   Nginx     │  (Reverse Proxy)
└─────────────┘
    │
    ▼
┌─────────────┐
│   Express   │  (App Entry)
│   Router    │
└─────────────┘
    │
    ├── /api/upload ──→ multer ──→ uploadRouter
    │
    ├── /api/process/:filterType ──→ processRouter ──→ imageService.processImage()
    │
    ├── /api/grid/generate ──→ gridRouter ──→ imageService.generateGrid()
    │
    ├── /api/grid/export ──→ gridRouter ──→ imageService.exportPattern()
    │
    └── /api/preview ──→ previewRouter ──→ imageService.previewImage()
```

### Image Processing Pipeline

```
Raw Image
    │
    ▼
┌─────────────────┐
│   Sharp Library │  (Load & decode)
└─────────────────┘
    │
    ▼
┌─────────────────┐
│   Raw Buffer    │  (Width × Height × Channels)
└─────────────────┘
    │
    ├──► Threshold Filter ──► Binary Buffer (0 or 255)
    │
    ├──► Halftone Filter ──► Dithered Buffer
    │
    ├──► Posterize Filter ──► Quantized Buffer
    │
    └──► Pixelate Filter ──► Block-averaged Buffer
    │
    ▼
┌─────────────────┐
│   Sharp Encode  │  (PNG output)
└─────────────────┘
    │
    ▼
Processed Image (saved to uploads/)
    │
    ▼
Grid Generation (sample center pixels)
    │
    ▼
Export (SVG/PNG/PDF)
```

### Filter Algorithms

#### Threshold
```
For each pixel:
    if invert:
        output = pixel <= threshold ? 255 : 0
    else:
        output = pixel > threshold ? 255 : 0
```

#### Halftone (Bayer Dithering)
```
4x4 Bayer matrix:
[ 0  8  2  10]
[12  4  14  6]
[ 3  11  1  9]
[15  7  13  5]

For each pixel at (x, y):
    threshold = (matrix[y%4][x%4] + 1) * scale
    output = pixel > threshold ? 255 : 0
```

#### Posterize
```
step = 255 / (levels - 1)
For each pixel:
    output = round(pixel / step) * step
```

#### Pixelate
```
For each block (grid of blockSize × blockSize):
    average = mean(pixel values in block)
    For each pixel in block:
        output = average
```

## Data Flow

### Upload Flow
```
User selects file
    │
    ▼
Frontend validates (type, size)
    │
    ▼
POST /api/upload (multipart/form-data)
    │
    ▼
Multer saves to uploads/
    │
    ▼
Returns { filename, originalname, mimetype, size }
    │
    ▼
Frontend stores imageId in Zustand
    │
    ▼
Proceeds to Filter step
```

### Filter Application Flow
```
User selects filter + parameters
    │
    ▼
POST /api/process/:filterType
    │
    ▼
Backend loads image from uploads/
    │
    ▼
Applies filter algorithm
    │
    ▼
Saves processed image to uploads/processed-{id}.png
    │
    ▼
Returns { processedImageUrl }
    │
    ▼
Frontend displays processed preview
```

### Grid Generation Flow
```
User sets grid dimensions
    │
    ▼
POST /api/grid/generate
    │
    ▼
Backend loads processed image
    │
    ▼
Divides image into grid cells
    │
    ▼
Samples center pixel of each cell
    │
    ▼
Converts to 0/1 based on threshold (128)
    │
    ▼
Returns { grid: [[0,1,0,...], ...] }
    │
    ▼
Frontend renders CSS Grid
```

### Export Flow
```
User selects format
    │
    ▼
POST /api/grid/export
    │
    ▼
Backend generates grid
    │
    ▼
Format-specific generation:
    ├── SVG: XML with rectangles
    ├── PNG: Sharp buffer with colored cells
    └── PDF: Text representation
    │
    ▼
Returns file or data
    │
    ▼
Frontend triggers download
```

## Security

### Frontend
- Input validation (file type, size)
- XSS protection (React's built-in escaping)
- CSRF protection (not needed for stateless API)

### Backend
- Helmet.js (security headers)
- CORS (configured for frontend origin)
- Rate limiting (100 requests per 15 minutes)
- File type validation (MIME type check)
- File size limits (10MB)
- Error handling (no sensitive data leaked)

### Infrastructure
- Nginx reverse proxy
- HTTPS/TLS (in production)
- AWS S3 for file storage (in production)
- CloudFront CDN (in production)

## Testing Strategy

### Test Pyramid
```
    ┌─────────┐
    │   E2E   │  4 tests (user flows)
    │  Tests  │
    ├─────────┤
    │   API   │  68 tests (integration)
    │  Tests  │
    ├─────────┤
    │  Unit   │  85 tests (components + services)
    │  Tests  │
    └─────────┘
```

### Coverage Requirements
- **Frontend**: 80% minimum (96.17% achieved)
- **Backend**: 80% minimum (100% achieved)
- **Critical paths**: 90% minimum (image processing, API endpoints)

### Test Types
- **Unit tests**: Components, hooks, services
- **Integration tests**: API endpoints, database operations
- **E2E tests**: Complete user flows (upload → filter → grid → export)
- **Accessibility tests**: aXe compliance (WCAG 2.1 AA)
- **Cross-browser tests**: Feature detection, responsive design
- **Performance tests**: Processing time under 5s for 1000x1000 images

## Deployment

### Local Development
```bash
# Docker Compose (recommended)
docker-compose up -d

# Or individual services
pnpm dev:api    # Backend
pnpm dev:web    # Frontend
pnpm storybook  # Storybook
```

### CI/CD Pipeline
```
Git Push
    │
    ▼
GitHub Actions
    │
    ├── Lint & Format Check
    ├── Run Tests (with coverage)
    ├── Build Docker Images
    └── Deploy to AWS (main branch)
    │
    ▼
AWS Infrastructure
    │
    ├── EC2 (API servers)
    ├── S3 (file storage + static frontend)
    └── CloudFront (CDN)
```

## Technology Decisions

### Why React 19?
- Latest stable version with concurrent features
- Better performance with automatic batching
- Improved Suspense for data fetching

### Why Vite?
- Fast development server (ESM)
- Optimized production builds
- Simple configuration

### Why MUI?
- Complete component library
- Consistent design system
- Accessibility built-in
- Theme customization

### Why Sharp?
- High-performance image processing
- Native bindings (libvips)
- Supports all required formats
- Streaming processing

### Why Zustand?
- Lightweight (1KB)
- Simple API
- No providers needed
- TypeScript support

### Why pnpm?
- Disk space efficient
- Fast installation
- Workspace support
- Strict dependency resolution

## Scalability Considerations

### Current Limitations
- File storage: Local filesystem (uploads/)
- Image processing: Single-threaded
- Memory: Loads entire image into buffer

### Future Improvements
- **S3 integration**: Move file storage to S3
- **Queue system**: Use Redis/Bull for async processing
- **Worker threads**: Process images in parallel
- **Caching**: Cache processed images in Redis
- **CDN**: Serve images from CloudFront
- **Database**: Store metadata in PostgreSQL

## Monitoring & Logging

### Backend Logging
- **Winston**: Structured logging
- **Levels**: error, warn, info, debug
- **Format**: JSON with timestamps
- **Output**: Console + file (in production)

### Frontend Monitoring
- **Console errors**: Logged to backend
- **Performance**: React DevTools Profiler
- **Accessibility**: aXe core automatic checks

### Health Checks
- **Endpoint**: GET /health
- **Response**: { status: "ok" }
- **Usage**: Docker, Kubernetes, load balancers

---

**Last Updated:** 2026-06-11
**Version:** 1.0.0
**Authors:** OpenCrochet Team
