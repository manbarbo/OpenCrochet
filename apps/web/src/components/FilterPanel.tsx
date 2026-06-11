import { useState } from 'react'
import { Box, Button, Typography, Slider, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useAppStore } from '@stores/appStore'
import ImagePreview from './ImagePreview'

interface FilterPanelProps {
  imageId: string
}

export default function FilterPanel({ imageId }: FilterPanelProps) {
  const [filterType, setFilterType] = useState<string>('threshold')
  const [threshold, setThreshold] = useState(128)
  const [invert, setInvert] = useState(false)
  const [levels, setLevels] = useState(2)
  const [blockSize, setBlockSize] = useState(10)
  const [dotSize, setDotSize] = useState(4)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const { processedImage, setProcessedImage, setCurrentFilter, setError } = useAppStore()

  const handleFilterChange = (
    _event: React.MouseEvent<HTMLElement>,
    newFilter: string,
  ) => {
    if (newFilter !== null) {
      setFilterType(newFilter)
    }
  }

  const applyFilter = async () => {
    setIsProcessing(true)
    setError(null)
    
    try {
      const params: Record<string, number | boolean> = {}
      
      switch (filterType) {
        case 'threshold':
          params.threshold = threshold
          params.invert = invert
          break
        case 'posterize':
          params.levels = levels
          break
        case 'pixelate':
          params.blockSize = blockSize
          break
        case 'halftone':
          params.dotSize = dotSize
          break
        default:
          break
      }

      const response = await fetch(`/api/process/${filterType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId,
          parameters: params,
        }),
      })

      if (!response.ok) {
        throw new Error('Error processing image')
      }

      const data = await response.json()
      setProcessedImage(data.processedImageUrl)
      setCurrentFilter(filterType)
    } catch (err) {
      setError('Error al aplicar el filtro')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Box>
      <ImagePreview
        originalImageId={imageId}
        processedImageUrl={processedImage || undefined}
        showOriginal={true}
        showProcessed={!!processedImage}
        title="Vista previa del filtro"
      />

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Seleccionar Filtro
        </Typography>

        <ToggleButtonGroup
          value={filterType}
          exclusive
          onChange={handleFilterChange}
          aria-label="filter type"
          sx={{ mb: 3, display: 'flex', flexWrap: 'wrap' }}
        >
          <ToggleButton value="threshold" aria-label="threshold">
            Threshold
          </ToggleButton>
          <ToggleButton value="halftone" aria-label="halftone">
            Halftone
          </ToggleButton>
          <ToggleButton value="posterize" aria-label="posterize">
            Posterize
          </ToggleButton>
          <ToggleButton value="pixelate" aria-label="pixelate">
            Pixelate
          </ToggleButton>
        </ToggleButtonGroup>

        <Box sx={{ mb: 3 }}>
          {filterType === 'threshold' && (
            <>
              <Typography gutterBottom>
                Threshold: {threshold}
              </Typography>
              <Slider
                value={threshold}
                onChange={(_, value) => setThreshold(value as number)}
                min={0}
                max={255}
                valueLabelDisplay="auto"
                aria-label="Threshold"
              />
              <ToggleButton
                value="invert"
                selected={invert}
                onChange={() => setInvert(!invert)}
                sx={{ mt: 1 }}
              >
                Invertir
              </ToggleButton>
            </>
          )}

          {filterType === 'halftone' && (
            <>
              <Typography gutterBottom>
                Tamaño de punto: {dotSize}px
              </Typography>
              <Slider
                value={dotSize}
                onChange={(_, value) => setDotSize(value as number)}
                min={1}
                max={20}
                valueLabelDisplay="auto"
                aria-label="Tamaño de punto"
              />
            </>
          )}

          {filterType === 'posterize' && (
            <>
              <Typography gutterBottom>
                Niveles: {levels}
              </Typography>
              <Slider
                value={levels}
                onChange={(_, value) => setLevels(value as number)}
                min={2}
                max={256}
                valueLabelDisplay="auto"
                aria-label="Niveles"
              />
            </>
          )}

          {filterType === 'pixelate' && (
            <>
              <Typography gutterBottom>
                Tamaño de bloque: {blockSize}px
              </Typography>
              <Slider
                value={blockSize}
                onChange={(_, value) => setBlockSize(value as number)}
                min={1}
                max={100}
                valueLabelDisplay="auto"
                aria-label="Tamaño de bloque"
              />
            </>
          )}
        </Box>

        <Button
          variant="contained"
          onClick={applyFilter}
          disabled={isProcessing}
          fullWidth
        >
          {isProcessing ? 'Procesando...' : 'Aplicar Filtro'}
        </Button>
      </Paper>
    </Box>
  )
}
