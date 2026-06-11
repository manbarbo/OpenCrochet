import { performance } from 'perf_hooks'
import sharp from 'sharp'
import { processImage, applyThreshold, generateGrid, exportPattern, previewImage } from '../imageService'

jest.mock('sharp', () => {
  const actualSharp = jest.requireActual('sharp')
  return actualSharp
})

describe('Image Processing Performance', () => {
  const testImageId = 'perf-test.png'
  const testImagePath = `uploads/${testImageId}`
  const processedImagePath = `uploads/processed-${testImageId}.png`
  const MAX_PROCESSING_TIME = 5000 // 5 seconds

  beforeAll(async () => {
    // Create uploads directory if it doesn't exist
    const fs = require('fs/promises')
    try {
      await fs.mkdir('uploads', { recursive: true })
    } catch (e) {
      // Directory might already exist
    }
    
    // Create a 1000x1000 grayscale test image
    const width = 1000
    const height = 1000
    const pixelData = Buffer.alloc(width * height)
    
    for (let i = 0; i < pixelData.length; i++) {
      pixelData[i] = Math.floor(Math.random() * 256)
    }
    
    await sharp(pixelData, {
      raw: { width, height, channels: 1 }
    }).png().toFile(testImagePath)
  })

  afterAll(async () => {
    // Cleanup
    try {
      const fs = require('fs/promises')
      await fs.unlink(testImagePath).catch(() => {})
      await fs.unlink(processedImagePath).catch(() => {})
    } catch (e) {
      // Ignore cleanup errors
    }
  })

  describe('Filter Algorithm Performance', () => {
    it('threshold filter should process 1000x1000 in under 5s', async () => {
      const image = sharp(testImagePath)
      const { data, info } = await image.raw().toBuffer({ resolveWithObject: true })
      
      const startTime = performance.now()
      
      applyThreshold(data, info.width, info.height, 128, false)
      
      const endTime = performance.now()
      const processingTime = endTime - startTime
      
      expect(processingTime).toBeLessThan(MAX_PROCESSING_TIME)
      expect(processingTime).toBeLessThan(1000) // Should be much faster than 5s
    })

    it('halftone filter should process 1000x1000 in under 5s', async () => {
      const image = sharp(testImagePath)
      const { data, info } = await image.raw().toBuffer({ resolveWithObject: true })
      
      const startTime = performance.now()
      
      // We need to test the halftone function, but it's not exported
      // We'll test it through processImage instead
      const result = await processImage(testImageId, 'halftone', { dotSize: 4 })
      
      const endTime = performance.now()
      const processingTime = endTime - startTime
      
      expect(processingTime).toBeLessThan(MAX_PROCESSING_TIME)
      expect(result.processedImageUrl).toBeDefined()
    })

    it('posterize filter should process 1000x1000 in under 5s', async () => {
      const startTime = performance.now()
      
      const result = await processImage(testImageId, 'posterize', { levels: 4 })
      
      const endTime = performance.now()
      const processingTime = endTime - startTime
      
      expect(processingTime).toBeLessThan(MAX_PROCESSING_TIME)
      expect(result.processedImageUrl).toBeDefined()
    })

    it('pixelate filter should process 1000x1000 in under 5s', async () => {
      const startTime = performance.now()
      
      const result = await processImage(testImageId, 'pixelate', { blockSize: 10 })
      
      const endTime = performance.now()
      const processingTime = endTime - startTime
      
      expect(processingTime).toBeLessThan(MAX_PROCESSING_TIME)
      expect(result.processedImageUrl).toBeDefined()
    })
  })

  describe('Pipeline Performance', () => {
    it('full pipeline (process + grid + export) should complete in under 5s', async () => {
      const startTime = performance.now()
      
      // Process image
      const processResult = await processImage(testImageId, 'threshold', { threshold: 128, invert: false })
      
      // Generate grid
      const grid = await generateGrid(testImageId, 20, 20)
      
      // Export pattern
      const exportResult = await exportPattern(testImageId, 'svg', 20, 20)
      
      const endTime = performance.now()
      const totalTime = endTime - startTime
      
      expect(totalTime).toBeLessThan(MAX_PROCESSING_TIME)
      expect(processResult.processedImageUrl).toBeDefined()
      expect(grid).toBeDefined()
      expect(grid.length).toBe(20)
      expect(exportResult).toBeDefined()
    })

    it('preview endpoint should respond in under 5s', async () => {
      const startTime = performance.now()
      
      const previewUrl = await previewImage(testImageId, 'threshold', { threshold: 128, invert: false })
      
      const endTime = performance.now()
      const processingTime = endTime - startTime
      
      expect(processingTime).toBeLessThan(MAX_PROCESSING_TIME)
      expect(previewUrl).toBeDefined()
    })
  })

  describe('Memory Usage', () => {
    it('should handle large images without memory issues', async () => {
      const initialMemory = process.memoryUsage().heapUsed
      
      // Process multiple filters
      await processImage(testImageId, 'threshold', { threshold: 128, invert: false })
      await processImage(testImageId, 'posterize', { levels: 4 })
      
      const finalMemory = process.memoryUsage().heapUsed
      const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024 // MB
      
      // Memory increase should be reasonable (less than 500MB)
      expect(memoryIncrease).toBeLessThan(500)
    })
  })
})
