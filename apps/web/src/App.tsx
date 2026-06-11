import { useState } from 'react'
import { CssBaseline, Container, Box, Stepper, Step, StepLabel, Typography, Button } from '@mui/material'
import { RestartAlt as RestartAltIcon } from '@mui/icons-material'
import ImageUploader from './components/ImageUploader'
import FilterPanel from './components/FilterPanel'
import GridPreview from './components/GridPreview'
import ImagePreview from './components/ImagePreview'
import { useAppStore } from './stores/appStore'

const steps = ['Subir Imagen', 'Aplicar Filtro', 'Generar Grid']

function App() {
  const [activeStep, setActiveStep] = useState(0)
  const { uploadedImage, processedImage, setUploadedImage, setProcessedImage, setCurrentFilter, setGrid, setError, error } = useAppStore()

  const handleImageUpload = (imageId: string) => {
    setUploadedImage(imageId)
    setActiveStep(1)
  }

  const handleFilterApplied = () => {
    setActiveStep(2)
  }

  const handleReset = () => {
    setUploadedImage(null)
    setProcessedImage(null)
    setCurrentFilter(null)
    setGrid(null)
    setError(null)
    setActiveStep(0)
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Typography variant="h3" component="h1" align="center" gutterBottom>
            OpenCrochet
          </Typography>
          <Typography variant="subtitle1" component="p" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Convierte imágenes en patrones de crochet filet
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <ImageUploader onUpload={handleImageUpload} />
          )}

          {activeStep === 1 && uploadedImage && (
            <>
              <FilterPanel imageId={uploadedImage} />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleFilterApplied}
                  disabled={!processedImage}
                >
                  Continuar al Grid
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  startIcon={<RestartAltIcon />}
                >
                  Reiniciar
                </Button>
              </Box>
            </>
          )}

          {activeStep === 2 && uploadedImage && (
            <>
              <ImagePreview
                originalImageId={uploadedImage}
                processedImageUrl={processedImage || undefined}
                showOriginal={false}
                showProcessed={true}
                title="Imagen procesada"
              />
              <GridPreview imageId={uploadedImage} />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  startIcon={<RestartAltIcon />}
                >
                  Nueva imagen
                </Button>
              </Box>
            </>
          )}

          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Container>
    </>
  )
}

export default App
