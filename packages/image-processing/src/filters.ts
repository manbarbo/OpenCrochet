export interface FilterParameters {
  threshold: number
  invert: boolean
}

export const applyThreshold = (
  data: Buffer,
  width: number,
  height: number,
  params: FilterParameters
): Buffer => {
  const output = Buffer.alloc(width * height)
  
  for (let i = 0; i < data.length; i++) {
    const pixel = data[i]
    const isFilled = params.invert ? pixel <= params.threshold : pixel > params.threshold
    output[i] = isFilled ? 255 : 0
  }
  
  return output
}

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
