import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import ImagePreview from '../ImagePreview'

const theme = createTheme()

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('ImagePreview', () => {
  it('renders nothing when no images provided', () => {
    const { container } = renderWithTheme(
      <ImagePreview 
        showOriginal={false} 
        showProcessed={false} 
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders original image', () => {
    renderWithTheme(
      <ImagePreview 
        originalImageId="test-123"
        showOriginal={true}
        showProcessed={false}
      />
    )
    expect(screen.getByText('Vista previa')).toBeInTheDocument()
    expect(screen.getByText('Imagen Original')).toBeInTheDocument()
    expect(screen.getByAltText('Original')).toBeInTheDocument()
  })

  it('renders processed image', () => {
    renderWithTheme(
      <ImagePreview 
        processedImageUrl="/uploads/processed.png"
        showOriginal={false}
        showProcessed={true}
      />
    )
    expect(screen.getByText('Imagen Procesada')).toBeInTheDocument()
    expect(screen.getByAltText('Procesada')).toBeInTheDocument()
  })

  it('renders both original and processed images', () => {
    renderWithTheme(
      <ImagePreview 
        originalImageId="test-123"
        processedImageUrl="/uploads/processed.png"
        showOriginal={true}
        showProcessed={true}
      />
    )
    expect(screen.getByText('Imagen Original')).toBeInTheDocument()
    expect(screen.getByText('Imagen Procesada')).toBeInTheDocument()
  })

  it('renders with custom title', () => {
    renderWithTheme(
      <ImagePreview 
        originalImageId="test-123"
        showOriginal={true}
        showProcessed={false}
        title="Custom Title"
      />
    )
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
  })
})
