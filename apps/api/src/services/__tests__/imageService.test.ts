import sharp from 'sharp'
import {
  processImage,
  previewImage,
  applyThreshold,
  generateGrid,
  exportPattern,
} from '../imageService'

jest.mock('sharp')
jest.mock('fs/promises')

describe('ImageService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('applyThreshold', () => {
    it('should convert pixels to black and white based on threshold', () => {
      const data = Buffer.from([100, 150, 200, 50])
      const result = applyThreshold(data, 2, 2, 128, false)
      
      expect(result[0]).toBe(0)  // 100 < 128 = black
      expect(result[1]).toBe(255) // 150 > 128 = white
      expect(result[2]).toBe(255) // 200 > 128 = white
      expect(result[3]).toBe(0)  // 50 < 128 = black
    })

    it('should invert when invert is true', () => {
      const data = Buffer.from([100, 150, 200, 50])
      const result = applyThreshold(data, 2, 2, 128, true)
      
      expect(result[0]).toBe(255) // 100 <= 128 = white (inverted)
      expect(result[1]).toBe(0)   // 150 > 128 = black (inverted)
    })
  })

  describe('processImage', () => {
    it('should process threshold filter', async () => {
      const mockData = Buffer.from([100, 150, 200, 50])
      const mockToBuffer = jest.fn().mockResolvedValue({
        data: mockData,
        info: { width: 2, height: 2, channels: 1 },
      })
      
      const mockSharpInstance = {
        raw: jest.fn().mockReturnValue({ toBuffer: mockToBuffer }),
      }
      
      const mockOutputSharp = {
        toFile: jest.fn().mockResolvedValue(undefined),
      }
      
      ;(sharp as any).mockImplementation((input: any, options?: any) => {
        if (options && options.raw) {
          return mockOutputSharp
        }
        return mockSharpInstance
      })

      const result = await processImage('test.png', 'threshold', { threshold: 128, invert: false })
      
      expect(result.filterType).toBe('threshold')
      expect(result.processedImageUrl).toContain('processed-')
    })

    it('should process posterize filter', async () => {
      const mockData = Buffer.from([100, 150, 200, 50])
      const mockToBuffer = jest.fn().mockResolvedValue({
        data: mockData,
        info: { width: 2, height: 2, channels: 1 },
      })
      
      const mockSharpInstance = {
        raw: jest.fn().mockReturnValue({ toBuffer: mockToBuffer }),
      }
      
      const mockOutputSharp = {
        toFile: jest.fn().mockResolvedValue(undefined),
      }
      
      ;(sharp as any).mockImplementation((input: any, options?: any) => {
        if (options && options.raw) {
          return mockOutputSharp
        }
        return mockSharpInstance
      })

      const result = await processImage('test.png', 'posterize', { levels: 4 })
      
      expect(result.filterType).toBe('posterize')
    })

    it('should process halftone filter', async () => {
      const mockData = Buffer.from([100, 150, 200, 50])
      const mockToBuffer = jest.fn().mockResolvedValue({
        data: mockData,
        info: { width: 2, height: 2, channels: 1 },
      })
      
      const mockSharpInstance = {
        raw: jest.fn().mockReturnValue({ toBuffer: mockToBuffer }),
      }
      
      const mockOutputSharp = {
        toFile: jest.fn().mockResolvedValue(undefined),
      }
      
      ;(sharp as any).mockImplementation((input: any, options?: any) => {
        if (options && options.raw) {
          return mockOutputSharp
        }
        return mockSharpInstance
      })

      const result = await processImage('test.png', 'halftone', { dotSize: 4 })
      
      expect(result.filterType).toBe('halftone')
    })

    it('should process pixelate filter', async () => {
      const mockData = Buffer.from([100, 150, 200, 50])
      const mockToBuffer = jest.fn().mockResolvedValue({
        data: mockData,
        info: { width: 2, height: 2, channels: 1 },
      })
      
      const mockSharpInstance = {
        raw: jest.fn().mockReturnValue({ toBuffer: mockToBuffer }),
      }
      
      const mockOutputSharp = {
        toFile: jest.fn().mockResolvedValue(undefined),
      }
      
      ;(sharp as any).mockImplementation((input: any, options?: any) => {
        if (options && options.raw) {
          return mockOutputSharp
        }
        return mockSharpInstance
      })

      const result = await processImage('test.png', 'pixelate', { blockSize: 10 })
      
      expect(result.filterType).toBe('pixelate')
    })

    it('should throw error for unsupported filter type', async () => {
      const mockData = Buffer.from([100, 150, 200, 50])
      const mockToBuffer = jest.fn().mockResolvedValue({
        data: mockData,
        info: { width: 2, height: 2, channels: 1 },
      })
      
      const mockSharpInstance = {
        raw: jest.fn().mockReturnValue({ toBuffer: mockToBuffer }),
      }
      
      const mockOutputSharp = {
        toFile: jest.fn().mockResolvedValue(undefined),
      }
      
      ;(sharp as any).mockImplementation((input: any, options?: any) => {
        if (options && options.raw) {
          return mockOutputSharp
        }
        return mockSharpInstance
      })

      await expect(processImage('test.png', 'unsupported', {})).rejects.toThrow('Failed to process image')
    })

    it('should throw error when sharp fails', async () => {
      ;(sharp as any).mockImplementation(() => {
        throw new Error('Sharp error')
      })

      await expect(processImage('test.png', 'threshold', {})).rejects.toThrow('Failed to process image')
    })
  })

  describe('previewImage', () => {
    it('should preview threshold filter', async () => {
      const mockData = Buffer.from([100, 150, 200, 50])
      const mockToBuffer = jest.fn().mockResolvedValue({
        data: mockData,
        info: { width: 2, height: 2, channels: 1 },
      })
      
      const mockSharpInstance = {
        raw: jest.fn().mockReturnValue({ toBuffer: mockToBuffer }),
      }
      
      const mockOutputSharp = {
        toFile: jest.fn().mockResolvedValue(undefined),
      }
      
      ;(sharp as any).mockImplementation((input: any, options?: any) => {
        if (options && options.raw) {
          return mockOutputSharp
        }
        return mockSharpInstance
      })

      const result = await previewImage('test.png', 'threshold', { threshold: 128, invert: false })
      
      expect(result).toContain('preview-')
      expect(result).toContain('.png')
    })

    it('should preview halftone filter', async () => {
      const mockData = Buffer.from([100, 150, 200, 50])
      const mockToBuffer = jest.fn().mockResolvedValue({
        data: mockData,
        info: { width: 2, height: 2, channels: 1 },
      })
      
      const mockSharpInstance = {
        raw: jest.fn().mockReturnValue({ toBuffer: mockToBuffer }),
      }
      
      const mockOutputSharp = {
        toFile: jest.fn().mockResolvedValue(undefined),
      }
      
      ;(sharp as any).mockImplementation((input: any, options?: any) => {
        if (options && options.raw) {
          return mockOutputSharp
        }
        return mockSharpInstance
      })

      const result = await previewImage('test.png', 'halftone', { dotSize: 4 })
      
      expect(result).toContain('preview-')
    })

    it('should preview posterize filter', async () => {
      const mockData = Buffer.from([100, 150, 200, 50])
      const mockToBuffer = jest.fn().mockResolvedValue({
        data: mockData,
        info: { width: 2, height: 2, channels: 1 },
      })
      
      const mockSharpInstance = {
        raw: jest.fn().mockReturnValue({ toBuffer: mockToBuffer }),
      }
      
      const mockOutputSharp = {
        toFile: jest.fn().mockResolvedValue(undefined),
      }
      
      ;(sharp as any).mockImplementation((input: any, options?: any) => {
        if (options && options.raw) {
          return mockOutputSharp
        }
        return mockSharpInstance
      })

      const result = await previewImage('test.png', 'posterize', { levels: 4 })
      
      expect(result).toContain('preview-')
    })

    it('should preview pixelate filter', async () => {
      const mockData = Buffer.from([100, 150, 200, 50])
      const mockToBuffer = jest.fn().mockResolvedValue({
        data: mockData,
        info: { width: 2, height: 2, channels: 1 },
      })
      
      const mockSharpInstance = {
        raw: jest.fn().mockReturnValue({ toBuffer: mockToBuffer }),
      }
      
      const mockOutputSharp = {
        toFile: jest.fn().mockResolvedValue(undefined),
      }
      
      ;(sharp as any).mockImplementation((input: any, options?: any) => {
        if (options && options.raw) {
          return mockOutputSharp
        }
        return mockSharpInstance
      })

      const result = await previewImage('test.png', 'pixelate', { blockSize: 10 })
      
      expect(result).toContain('preview-')
    })

    it('should throw error for unsupported filter type in preview', async () => {
      const mockData = Buffer.from([100, 150, 200, 50])
      const mockToBuffer = jest.fn().mockResolvedValue({
        data: mockData,
        info: { width: 2, height: 2, channels: 1 },
      })
      
      const mockSharpInstance = {
        raw: jest.fn().mockReturnValue({ toBuffer: mockToBuffer }),
      }
      
      ;(sharp as any).mockReturnValue(mockSharpInstance)

      await expect(previewImage('test.png', 'unsupported', {})).rejects.toThrow('Failed to preview image')
    })

    it('should throw error when sharp fails in preview', async () => {
      ;(sharp as any).mockImplementation(() => {
        throw new Error('Sharp error')
      })

      await expect(previewImage('test.png', 'threshold', {})).rejects.toThrow('Failed to preview image')
    })
  })

  describe('generateGrid', () => {
    it('should create grid from processed image', async () => {
      const mockData = Buffer.from([
        0, 255,
        255, 0
      ])
      
      const mockSharpInstance = {
        raw: jest.fn().mockReturnValue({
          toBuffer: jest.fn().mockResolvedValue({
            data: mockData,
            info: { width: 2, height: 2, channels: 1 },
          }),
        }),
      }
      
      ;(sharp as any).mockReturnValue(mockSharpInstance)

      const grid = await generateGrid('test.png', 2, 2)
      
      expect(grid[0][0]).toBe(0)
      expect(grid[0][1]).toBe(1)
      expect(grid[1][0]).toBe(1)
      expect(grid[1][1]).toBe(0)
    })

    it('should create grid with larger dimensions', async () => {
      const mockData = Buffer.from([
        0, 0, 255, 255,
        0, 0, 255, 255,
        255, 255, 0, 0,
        255, 255, 0, 0,
      ])
      
      const mockSharpInstance = {
        raw: jest.fn().mockReturnValue({
          toBuffer: jest.fn().mockResolvedValue({
            data: mockData,
            info: { width: 4, height: 4, channels: 1 },
          }),
        }),
      }
      
      ;(sharp as any).mockReturnValue(mockSharpInstance)

      const grid = await generateGrid('test.png', 2, 2)
      
      expect(grid).toHaveLength(2)
      expect(grid[0]).toHaveLength(2)
    })
  })

  describe('exportPattern', () => {
    it('should export SVG pattern', async () => {
      const mockData = Buffer.from([
        0, 255,
        255, 0
      ])
      
      const mockSharpInstance = {
        raw: jest.fn().mockReturnValue({
          toBuffer: jest.fn().mockResolvedValue({
            data: mockData,
            info: { width: 2, height: 2, channels: 1 },
          }),
        }),
      }
      
      ;(sharp as any).mockReturnValue(mockSharpInstance)

      const result = await exportPattern('test.png', 'svg', 2, 2)
      
      expect(result).toContain('<?xml version="1.0"')
      expect(result).toContain('<svg')
      expect(result).toContain('</svg>')
    })

    it('should export PNG pattern', async () => {
      const mockData = Buffer.from([
        0, 255,
        255, 0
      ])
      
      const mockToFile = jest.fn().mockResolvedValue(undefined)
      
      const mockSharpInstance = {
        raw: jest.fn().mockReturnValue({
          toBuffer: jest.fn().mockResolvedValue({
            data: mockData,
            info: { width: 2, height: 2, channels: 1 },
          }),
        }),
      }
      
      ;(sharp as any).mockImplementation((input: any, options?: any) => {
        if (options && options.raw) {
          return { png: () => ({ toFile: mockToFile }) }
        }
        return mockSharpInstance
      })

      const result = await exportPattern('test.png', 'png', 2, 2)
      
      expect(result).toContain('uploads')
      expect(result).toContain('.png')
    })

    it('should export PDF pattern', async () => {
      const mockData = Buffer.from([
        0, 255,
        255, 0
      ])
      
      const mockSharpInstance = {
        raw: jest.fn().mockReturnValue({
          toBuffer: jest.fn().mockResolvedValue({
            data: mockData,
            info: { width: 2, height: 2, channels: 1 },
          }),
        }),
      }
      
      ;(sharp as any).mockReturnValue(mockSharpInstance)

      const result = await exportPattern('test.png', 'pdf', 2, 2)
      
      expect(result).toContain('Filet Crochet Pattern')
      expect(result).toContain('X')
      expect(result).toContain('O')
    })

    it('should throw error for unsupported format', async () => {
      const mockData = Buffer.from([
        0, 255,
        255, 0
      ])
      
      const mockSharpInstance = {
        raw: jest.fn().mockReturnValue({
          toBuffer: jest.fn().mockResolvedValue({
            data: mockData,
            info: { width: 2, height: 2, channels: 1 },
          }),
        }),
      }
      
      ;(sharp as any).mockReturnValue(mockSharpInstance)

      await expect(exportPattern('test.png', 'unsupported' as any, 2, 2)).rejects.toThrow('Unsupported format')
    })
  })
})
