---
name: image-processing-pipeline
description: Implement image processing filters, grid generation, and pattern export. Use when building image processing features, filters, or pattern generation algorithms.
---

# Image Processing Pipeline Skill

Use this skill when implementing image processing features for the filet crochet pattern generator.

## Trigger
- Implementing image processing filters
- Building grid generation algorithms
- Creating pattern export functionality
- Optimizing image processing performance
- Adding AI-assisted pattern features

## Actions

### 1. Image Upload Endpoint
```typescript
// src/routes/upload.ts
import { Router } from 'express'
import multer from 'multer'
import { uploadController } from '../controllers/uploadController'

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and WebP are allowed.'))
    }
  },
})

const router = Router()
router.post('/', upload.single('image'), uploadController)

export default router
```

### 2. Image Validation
```typescript
// src/services/validationService.ts
import sharp from 'sharp'

export const validateImage = async (filePath: string) => {
  const metadata = await sharp(filePath).metadata()
  
  if (!metadata.width || !metadata.height) {
    throw new Error('Invalid image dimensions')
  }
  
  if (metadata.width > 5000 || metadata.height > 5000) {
    throw new Error('Image dimensions too large (max 5000x5000)')
  }
  
  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
  }
}
```

### 3. Preprocessing
```typescript
// src/services/preprocessingService.ts
import sharp from 'sharp'

export const preprocessImage = async (
  filePath: string,
  targetWidth: number = 200,
  targetHeight: number = 200
) => {
  return sharp(filePath)
    .resize(targetWidth, targetHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true })
}
```

### 4. Threshold Filter
```typescript
// src/services/filters/thresholdFilter.ts
export const applyThreshold = (
  data: Buffer,
  width: number,
  height: number,
  threshold: number = 128,
  invert: boolean = false
) => {
  const output = Buffer.alloc(width * height)
  
  for (let i = 0; i < data.length; i++) {
    const pixel = data[i]
    const isFilled = invert ? pixel <= threshold : pixel > threshold
    output[i] = isFilled ? 255 : 0
  }
  
  return output
}
```

### 5. Halftone Filter
```typescript
// src/services/filters/halftoneFilter.ts
export const applyHalftone = (
  data: Buffer,
  width: number,
  height: number,
  dotSize: number = 4,
  angle: number = 45
) => {
  // Ordered dithering implementation
  const matrix = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ]
  
  const output = Buffer.alloc(width * height)
  const matrixSize = 4
  const scale = 16 / (256 / dotSize)
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixel = data[y * width + x]
      const threshold = (matrix[y % matrixSize][x % matrixSize] + 1) * scale
      output[y * width + x] = pixel > threshold ? 255 : 0
    }
  }
  
  return output
}
```

### 6. Posterize Filter
```typescript
// src/services/filters/posterizeFilter.ts
export const applyPosterize = (
  data: Buffer,
  width: number,
  height: number,
  levels: number = 2
) => {
  const output = Buffer.alloc(width * height)
  const step = 255 / (levels - 1)
  
  for (let i = 0; i < data.length; i++) {
    output[i] = Math.round(data[i] / step) * step
  }
  
  return output
}
```

### 7. Pixelate Filter
```typescript
// src/services/filters/pixelateFilter.ts
export const applyPixelate = (
  data: Buffer,
  width: number,
  height: number,
  blockSize: number = 10
) => {
  const output = Buffer.alloc(width * height)
  const gridWidth = Math.ceil(width / blockSize)
  const gridHeight = Math.ceil(height / blockSize)
  
  for (let gy = 0; gy < gridHeight; gy++) {
    for (let gx = 0; gx < gridWidth; gx++) {
      let sum = 0
      let count = 0
      
      // Calculate average in block
      for (let y = gy * blockSize; y < Math.min((gy + 1) * blockSize, height); y++) {
        for (let x = gx * blockSize; x < Math.min((gx + 1) * blockSize, width); x++) {
          sum += data[y * width + x]
          count++
        }
      }
      
      const average = sum / count
      
      // Fill block with average
      for (let y = gy * blockSize; y < Math.min((gy + 1) * blockSize, height); y++) {
        for (let x = gx * blockSize; x < Math.min((gx + 1) * blockSize, width); x++) {
          output[y * width + x] = average
        }
      }
    }
  }
  
  return output
}
```

### 8. Grid Generation
```typescript
// src/services/gridService.ts
export const generateGrid = (
  data: Buffer,
  width: number,
  height: number,
  gridWidth: number,
  gridHeight: number
): number[][] => {
  const grid: number[][] = []
  const cellWidth = width / gridWidth
  const cellHeight = height / gridHeight
  
  for (let row = 0; row < gridHeight; row++) {
    grid[row] = []
    for (let col = 0; col < gridWidth; col++) {
      const centerX = Math.floor(col * cellWidth + cellWidth / 2)
      const centerY = Math.floor(row * cellHeight + cellHeight / 2)
      const pixel = data[centerY * width + centerX]
      grid[row][col] = pixel > 128 ? 1 : 0
    }
  }
  
  return grid
}
```

### 9. Pattern Export

#### SVG Export
```typescript
// src/services/export/svgExport.ts
export const exportToSVG = (
  grid: number[][],
  cellWidth: number = 10,
  cellHeight: number = 10
): string => {
  const gridWidth = grid[0].length
  const gridHeight = grid.length
  const svgWidth = gridWidth * cellWidth
  const svgHeight = gridHeight * cellHeight
  
  let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`
  
  for (let row = 0; row < gridHeight; row++) {
    for (let col = 0; col < gridWidth; col++) {
      if (grid[row][col] === 1) {
        svg += `<rect x="${col * cellWidth}" y="${row * cellHeight}" width="${cellWidth}" height="${cellHeight}" fill="black"/>`
      }
    }
  }
  
  svg += '</svg>'
  return svg
}
```

#### PNG Export
```typescript
// src/services/export/pngExport.ts
import sharp from 'sharp'

export const exportToPNG = async (
  grid: number[][],
  cellWidth: number = 10,
  cellHeight: number = 10
): Promise<Buffer> => {
  const gridWidth = grid[0].length
  const gridHeight = grid.length
  const width = gridWidth * cellWidth
  const height = gridHeight * cellHeight
  
  // Create raw pixel data
  const pixelData = Buffer.alloc(width * height * 4)
  
  for (let row = 0; row < gridHeight; row++) {
    for (let col = 0; col < gridWidth; col++) {
      const color = grid[row][col] === 1 ? 0 : 255
      for (let y = row * cellHeight; y < (row + 1) * cellHeight; y++) {
        for (let x = col * cellWidth; x < (col + 1) * cellWidth; x++) {
          const idx = (y * width + x) * 4
          pixelData[idx] = color     // R
          pixelData[idx + 1] = color // G
          pixelData[idx + 2] = color // B
          pixelData[idx + 3] = 255   // A
        }
      }
    }
  }
  
  return sharp(pixelData, {
    raw: { width, height, channels: 4 },
  }).png().toBuffer()
}
```

### 10. Real-time Preview Endpoint
```typescript
// src/routes/preview.ts
import { Router } from 'express'
import { previewController } from '../controllers/previewController'

const router = Router()
router.post('/', previewController)

export default router
```

## Requirements
- MUST validate and sanitize all inputs
- MUST handle errors gracefully (never crash)
- MUST optimize for performance (streaming, chunks)
- MUST support configurable parameters for all filters
- MUST provide progress feedback for long operations
- MUST write tests for all filters and algorithms (80%+ coverage)
- MUST ensure deterministic output (same input = same output)

## Performance Optimization
- Process images in chunks for large files
- Use Web Workers for browser-side processing
- Implement timeout for long operations (30 seconds)
- Clean up temporary files after processing
- Cache processed results when possible

## Testing Requirements
- Unit tests for each filter function
- Integration tests for the full pipeline
- Edge case tests (transparent images, non-square images, large files)
- Performance tests (processing under 5 seconds for 1000x1000px)
- Coverage must be 80%+ (90% for critical paths)

## API Endpoints
- `POST /api/upload` - Upload image
- `POST /api/process` - Apply filter and return processed image
- `POST /api/grid` - Generate grid from processed image
- `POST /api/export` - Export pattern (SVG, PNG, PDF)
- `GET /api/preview` - Real-time preview

## Parameters

### Threshold
- `threshold`: 0-255 (default: 128)
- `invert`: boolean (default: false)

### Halftone
- `dotSize`: 1-20 (default: 4)
- `angle`: 0-360 (default: 45)
- `shape`: 'circle' | 'line' | 'square' (default: 'circle')

### Posterize
- `levels`: 2-256 (default: 2)

### Pixelate
- `blockSize`: 1-100 (default: 10)
- `gridWidth`: number of cells horizontally
- `gridHeight`: number of cells vertically

### Grid Generation
- `gridWidth`: number of cells horizontally
- `gridHeight`: number of cells vertically
- `cellSize`: size in mm or inches

## Error Handling
- Invalid file type: 400 Bad Request
- File too large: 413 Payload Too Large
- Invalid parameters: 400 Bad Request
- Processing error: 500 Internal Server Error
- Timeout: 504 Gateway Timeout
