import { useState } from 'react'
import { Box, Button, Typography, Paper, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { Download as DownloadIcon } from '@mui/icons-material'
import { useAppStore } from '@stores/appStore'

interface GridPreviewProps {
  imageId: string
}

export default function GridPreview({ imageId }: GridPreviewProps) {
  const [gridWidth, setGridWidth] = useState(20)
  const [gridHeight, setGridHeight] = useState(20)
  const [grid, setGrid] = useState<number[][] | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [exportFormat, setExportFormat] = useState<string>('svg')
  const [isExporting, setIsExporting] = useState(false)
  
  const { processedImage } = useAppStore()

  const generateGrid = async () => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/grid/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId,
          gridWidth,
          gridHeight,
        }),
      })

      if (!response.ok) {
        throw new Error('Error generating grid')
      }

      const data = await response.json()
      setGrid(data.grid)
    } catch (err) {
      console.error('Error generating grid:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const exportPattern = async () => {
    setIsExporting(true)
    
    try {
      const response = await fetch('/api/grid/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId,
          format: exportFormat,
          gridWidth,
          gridHeight,
        }),
      })

      if (!response.ok) {
        throw new Error('Error exporting pattern')
      }

      if (exportFormat === 'svg' || exportFormat === 'png') {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `pattern.${exportFormat}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const data = await response.json()
        console.log('Pattern:', data.pattern)
      }
    } catch (err) {
      console.error('Error exporting pattern:', err)
    } finally {
      setIsExporting(false)
    }
  }

  const cellSize = 20

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Vista del Grid
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography gutterBottom>
          Dimensiones del grid:
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" id="grid-width-label">Ancho: {gridWidth}</Typography>
            <input
              type="range"
              min="5"
              max="50"
              value={gridWidth}
              onChange={(e) => setGridWidth(Number(e.target.value))}
              style={{ width: '100%' }}
              aria-label="Ancho del grid"
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" id="grid-height-label">Alto: {gridHeight}</Typography>
            <input
              type="range"
              min="5"
              max="50"
              value={gridHeight}
              onChange={(e) => setGridHeight(Number(e.target.value))}
              style={{ width: '100%' }}
              aria-label="Alto del grid"
            />
          </Grid>
        </Grid>
      </Box>

      <Button
        variant="contained"
        onClick={generateGrid}
        disabled={isGenerating || !processedImage}
        fullWidth
        sx={{ mb: 3 }}
      >
        {isGenerating ? 'Generando...' : 'Generar Grid'}
      </Button>

      {grid && (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridWidth}, ${cellSize}px)`,
              gap: 0,
              border: '1px solid #ccc',
              width: 'fit-content',
              mx: 'auto',
              mb: 3,
            }}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <Box
                  key={`${rowIndex}-${colIndex}`}
                  sx={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: cell === 1 ? 'black' : 'white',
                    border: '0.5px solid #eee',
                  }}
                />
              ))
            )}
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            Exportar Patrón
          </Typography>

          <ToggleButtonGroup
            value={exportFormat}
            exclusive
            onChange={(_, newFormat) => newFormat && setExportFormat(newFormat)}
            aria-label="Formato de exportación"
            sx={{ mb: 2 }}
          >
            <ToggleButton value="svg">SVG</ToggleButton>
            <ToggleButton value="png">PNG</ToggleButton>
            <ToggleButton value="pdf">PDF</ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={exportPattern}
            disabled={isExporting}
            fullWidth
          >
            {isExporting ? 'Exportando...' : `Exportar como ${exportFormat.toUpperCase()}`}
          </Button>
        </>
      )}
    </Paper>
  )
}
