import sharp from 'sharp'
import path from 'path'

interface ProcessImageResult {
  imageId: string
  filterType: string
  processedImageUrl: string
}

export const processImage = async (
  imageId: string,
  filterType: string,
  parameters: Record<string, number | boolean>
): Promise<ProcessImageResult> => {
  const inputPath = path.join(process.cwd(), 'uploads', imageId)
  const outputPath = path.join(process.cwd(), 'uploads', `processed-${imageId}.png`)

  try {
    const image = sharp(inputPath)
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true })
    
    let processedData: Buffer
    
    switch (filterType) {
      case 'threshold':
        processedData = applyThreshold(
          data,
          info.width,
          info.height,
          parameters.threshold as number || 128,
          parameters.invert as boolean || false
        )
        break
      case 'halftone':
        processedData = applyHalftone(
          data,
          info.width,
          info.height,
          parameters.dotSize as number || 4
        )
        break
      case 'posterize':
        processedData = applyPosterize(
          data,
          info.width,
          info.height,
          parameters.levels as number || 2
        )
        break
      case 'pixelate':
        processedData = await applyPixelate(
          inputPath,
          parameters.blockSize as number || 10
        )
        break
      default:
        throw new Error(`Unsupported filter type: ${filterType}`)
    }

    if (filterType !== 'pixelate') {
      await sharp(processedData, {
        raw: { width: info.width, height: info.height, channels: 1 }
      }).toFile(outputPath)
    }

    return {
      imageId,
      filterType,
      processedImageUrl: `/uploads/processed-${imageId}.png`,
    }
  } catch (error) {
    console.error('Error processing image:', error)
    throw new Error('Failed to process image')
  }
}

export const applyThreshold = (
  data: Buffer,
  width: number,
  height: number,
  threshold: number,
  invert: boolean
): Buffer => {
  const output = Buffer.alloc(width * height)
  
  for (let i = 0; i < data.length; i++) {
    const pixel = data[i]
    const isFilled = invert ? pixel <= threshold : pixel > threshold
    output[i] = isFilled ? 255 : 0
  }
  
  return output
}

const applyHalftone = (
  data: Buffer,
  width: number,
  height: number,
  dotSize: number
): Buffer => {
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

const applyPosterize = (
  data: Buffer,
  width: number,
  height: number,
  levels: number
): Buffer => {
  const output = Buffer.alloc(width * height)
  const step = 255 / (levels - 1)
  
  for (let i = 0; i < data.length; i++) {
    output[i] = Math.round(data[i] / step) * step
  }
  
  return output
}

const applyPixelate = async (
  inputPath: string,
  blockSize: number
): Promise<Buffer> => {
  const image = sharp(inputPath)
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true })
  
  const output = Buffer.alloc(info.width * info.height)
  const gridWidth = Math.ceil(info.width / blockSize)
  const gridHeight = Math.ceil(info.height / blockSize)
  
  for (let gy = 0; gy < gridHeight; gy++) {
    for (let gx = 0; gx < gridWidth; gx++) {
      let sum = 0
      let count = 0
      
      for (let y = gy * blockSize; y < Math.min((gy + 1) * blockSize, info.height); y++) {
        for (let x = gx * blockSize; x < Math.min((gx + 1) * blockSize, info.width); x++) {
          sum += data[y * info.width + x]
          count++
        }
      }
      
      const average = Math.round(sum / count)
      
      for (let y = gy * blockSize; y < Math.min((gy + 1) * blockSize, info.height); y++) {
        for (let x = gx * blockSize; x < Math.min((gx + 1) * blockSize, info.width); x++) {
          output[y * info.width + x] = average
        }
      }
    }
  }
  
  await sharp(output, {
    raw: { width: info.width, height: info.height, channels: 1 }
  }).toFile(inputPath + '.pixelated.png')
  
  return output
}

export const generateGrid = async (
  imageId: string,
  gridWidth: number,
  gridHeight: number
): Promise<number[][]> => {
  const inputPath = path.join(process.cwd(), 'uploads', `processed-${imageId}.png`)
  
  const image = sharp(inputPath)
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true })
  
  const grid: number[][] = []
  const cellWidth = info.width / gridWidth
  const cellHeight = info.height / gridHeight
  
  for (let row = 0; row < gridHeight; row++) {
    grid[row] = []
    for (let col = 0; col < gridWidth; col++) {
      const centerX = Math.floor(col * cellWidth + cellWidth / 2)
      const centerY = Math.floor(row * cellHeight + cellHeight / 2)
      const pixel = data[centerY * info.width + centerX]
      grid[row][col] = pixel > 128 ? 1 : 0
    }
  }
  
  return grid
}

export const previewImage = async (
  imageId: string,
  filterType: string,
  parameters: Record<string, number | boolean>
): Promise<string> => {
  const inputPath = path.join(process.cwd(), 'uploads', imageId)
  const previewPath = path.join(process.cwd(), 'uploads', `preview-${imageId}.png`)

  try {
    const image = sharp(inputPath)
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true })
    
    let processedData: Buffer
    
    switch (filterType) {
      case 'threshold':
        processedData = applyThreshold(
          data,
          info.width,
          info.height,
          parameters.threshold as number || 128,
          parameters.invert as boolean || false
        )
        break
      case 'halftone':
        processedData = applyHalftone(
          data,
          info.width,
          info.height,
          parameters.dotSize as number || 4
        )
        break
      case 'posterize':
        processedData = applyPosterize(
          data,
          info.width,
          info.height,
          parameters.levels as number || 2
        )
        break
      case 'pixelate':
        processedData = await applyPixelate(
          inputPath,
          parameters.blockSize as number || 10
        )
        break
      default:
        throw new Error(`Unsupported filter type: ${filterType}`)
    }

    if (filterType !== 'pixelate') {
      await sharp(processedData, {
        raw: { width: info.width, height: info.height, channels: 1 }
      }).toFile(previewPath)
    }

    return `/uploads/preview-${imageId}.png`
  } catch (error) {
    console.error('Error previewing image:', error)
    throw new Error('Failed to preview image')
  }
}

export const exportPattern = async (
  imageId: string,
  format: 'svg' | 'png' | 'pdf',
  gridWidth: number,
  gridHeight: number
): Promise<string> => {
  const grid = await generateGrid(imageId, gridWidth, gridHeight)
  
  switch (format) {
    case 'svg':
      return generateSVG(grid, gridWidth, gridHeight)
    case 'png':
      return generatePNG(grid, gridWidth, gridHeight)
    case 'pdf':
      return generatePDF(grid, gridWidth, gridHeight)
    default:
      throw new Error(`Unsupported format: ${format}`)
  }
}

const generateSVG = (
  grid: number[][],
  width: number,
  height: number
): string => {
  const cellWidth = 10
  const cellHeight = 10
  const svgWidth = width * cellWidth
  const svgHeight = height * cellHeight
  
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="white"/>
`
  
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (grid[row][col] === 1) {
        svg += `  <rect x="${col * cellWidth}" y="${row * cellHeight}" width="${cellWidth}" height="${cellHeight}" fill="black"/>
`
      }
    }
  }
  
  svg += '</svg>'
  return svg
}

const generatePNG = async (
  grid: number[][],
  width: number,
  height: number
): Promise<string> => {
  const cellWidth = 10
  const cellHeight = 10
  const imageWidth = width * cellWidth
  const imageHeight = height * cellHeight
  
  const pixelData = Buffer.alloc(imageWidth * imageHeight * 4)
  
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const color = grid[row][col] === 1 ? 0 : 255
      for (let y = row * cellHeight; y < (row + 1) * cellHeight; y++) {
        for (let x = col * cellWidth; x < (col + 1) * cellWidth; x++) {
          const idx = (y * imageWidth + x) * 4
          pixelData[idx] = color
          pixelData[idx + 1] = color
          pixelData[idx + 2] = color
          pixelData[idx + 3] = 255
        }
      }
    }
  }
  
  const outputPath = path.join(process.cwd(), 'uploads', `export-${Date.now()}.png`)
  
  await sharp(pixelData, {
    raw: { width: imageWidth, height: imageHeight, channels: 4 }
  }).png().toFile(outputPath)
  
  return outputPath
}

const generatePDF = (
  grid: number[][],
  width: number,
  height: number
): string => {
  // For now, return a simple text representation
  // In a real implementation, you'd use a PDF library like pdfkit
  let pattern = 'Filet Crochet Pattern\n\n'
  
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      pattern += grid[row][col] === 1 ? 'X' : 'O'
    }
    pattern += '\n'
  }
  
  return pattern
}
