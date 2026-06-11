import { Box, Paper, Typography } from '@mui/material'

interface ImagePreviewProps {
  originalImageId?: string
  processedImageUrl?: string
  showOriginal?: boolean
  showProcessed?: boolean
  title?: string
}

export default function ImagePreview({
  originalImageId,
  processedImageUrl,
  showOriginal = true,
  showProcessed = true,
  title = 'Vista previa',
}: ImagePreviewProps) {
  const hasOriginal = !!originalImageId
  const hasProcessed = !!processedImageUrl

  if (!hasOriginal && !hasProcessed) {
    return null
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        {showOriginal && hasOriginal && (
          <Box sx={{ flex: 1, minWidth: 200, maxWidth: 400 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom align="center">
              Imagen Original
            </Typography>
            <Box
              component="img"
              src={`/uploads/${originalImageId}`}
              alt="Original"
              sx={{
                width: '100%',
                maxHeight: 300,
                objectFit: 'contain',
                borderRadius: 1,
                border: '1px solid #e0e0e0',
              }}
            />
          </Box>
        )}
        
        {showProcessed && hasProcessed && (
          <Box sx={{ flex: 1, minWidth: 200, maxWidth: 400 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom align="center">
              Imagen Procesada
            </Typography>
            <Box
              component="img"
              src={processedImageUrl || ''}
              alt="Procesada"
              sx={{
                width: '100%',
                maxHeight: 300,
                objectFit: 'contain',
                borderRadius: 1,
                border: '1px solid #e0e0e0',
              }}
            />
          </Box>
        )}
      </Box>
    </Paper>
  )
}
