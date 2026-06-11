export interface ImageUploadRequest {
  file: File
}

export interface ImageUploadResponse {
  success: boolean
  file: {
    filename: string
    originalname: string
    mimetype: string
    size: number
  }
}

export interface FilterRequest {
  imageId: string
  filterType: 'threshold' | 'halftone' | 'posterize' | 'pixelate'
  parameters: Record<string, number | boolean>
}

export interface FilterResponse {
  imageId: string
  filterType: string
  processedImageUrl: string
}

export interface GridGenerationRequest {
  imageId: string
  gridWidth: number
  gridHeight: number
}

export interface GridGenerationResponse {
  grid: number[][]
  width: number
  height: number
}

export interface ExportRequest {
  imageId: string
  format: 'svg' | 'png' | 'pdf'
  gridWidth: number
  gridHeight: number
}

export interface ExportResponse {
  downloadUrl: string
  format: string
}
