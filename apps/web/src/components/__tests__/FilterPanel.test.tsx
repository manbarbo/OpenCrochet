import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import FilterPanel from '../FilterPanel'

const mockSetError = jest.fn()
const mockSetProcessedImage = jest.fn()
const mockSetCurrentFilter = jest.fn()

jest.mock('../../stores/appStore', () => ({
  useAppStore: jest.fn(() => ({
    processedImage: null,
    setProcessedImage: mockSetProcessedImage,
    setCurrentFilter: mockSetCurrentFilter,
    setError: mockSetError,
  })),
}))

jest.mock('../ImagePreview', () => {
  return function MockImagePreview() {
    return <div data-testid="mock-image-preview">ImagePreview</div>
  }
})

const theme = createTheme()

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('FilterPanel', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders filter selection', () => {
    renderWithTheme(<FilterPanel imageId="test-123" />)
    expect(screen.getByText('Seleccionar Filtro')).toBeInTheDocument()
    expect(screen.getByText('Threshold')).toBeInTheDocument()
    expect(screen.getByText('Halftone')).toBeInTheDocument()
    expect(screen.getByText('Posterize')).toBeInTheDocument()
    expect(screen.getByText('Pixelate')).toBeInTheDocument()
  })

  it('shows threshold controls by default', () => {
    renderWithTheme(<FilterPanel imageId="test-123" />)
    expect(screen.getByText(/Threshold:/)).toBeInTheDocument()
  })

  it('changes filter type to posterize', () => {
    renderWithTheme(<FilterPanel imageId="test-123" />)
    const posterizeButton = screen.getByText('Posterize')
    fireEvent.click(posterizeButton)
    expect(screen.getByText(/Niveles:/)).toBeInTheDocument()
  })

  it('changes filter type to halftone', () => {
    renderWithTheme(<FilterPanel imageId="test-123" />)
    const halftoneButton = screen.getByText('Halftone')
    fireEvent.click(halftoneButton)
    expect(screen.getByText(/Tamaño de punto:/)).toBeInTheDocument()
  })

  it('changes filter type to pixelate', () => {
    renderWithTheme(<FilterPanel imageId="test-123" />)
    const pixelateButton = screen.getByText('Pixelate')
    fireEvent.click(pixelateButton)
    expect(screen.getByText(/Tamaño de bloque:/)).toBeInTheDocument()
  })

  it('applies threshold filter successfully', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ processedImageUrl: '/uploads/processed-test.png' }),
    })

    renderWithTheme(<FilterPanel imageId="test-123" />)
    const applyButton = screen.getByText('Aplicar Filtro')
    fireEvent.click(applyButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/process/threshold', expect.any(Object))
    })
  })

  it('applies halftone filter successfully', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ processedImageUrl: '/uploads/processed-test.png' }),
    })

    renderWithTheme(<FilterPanel imageId="test-123" />)
    const halftoneButton = screen.getByText('Halftone')
    fireEvent.click(halftoneButton)
    
    const applyButton = screen.getByText('Aplicar Filtro')
    fireEvent.click(applyButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/process/halftone', expect.any(Object))
    })
  })

  it('applies posterize filter successfully', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ processedImageUrl: '/uploads/processed-test.png' }),
    })

    renderWithTheme(<FilterPanel imageId="test-123" />)
    const posterizeButton = screen.getByText('Posterize')
    fireEvent.click(posterizeButton)
    
    const applyButton = screen.getByText('Aplicar Filtro')
    fireEvent.click(applyButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/process/posterize', expect.any(Object))
    })
  })

  it('applies pixelate filter successfully', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ processedImageUrl: '/uploads/processed-test.png' }),
    })

    renderWithTheme(<FilterPanel imageId="test-123" />)
    const pixelateButton = screen.getByText('Pixelate')
    fireEvent.click(pixelateButton)
    
    const applyButton = screen.getByText('Aplicar Filtro')
    fireEvent.click(applyButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/process/pixelate', expect.any(Object))
    })
  })

  it('handles filter application error', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    })

    renderWithTheme(<FilterPanel imageId="test-123" />)
    const applyButton = screen.getByText('Aplicar Filtro')
    fireEvent.click(applyButton)

    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith('Error al aplicar el filtro')
    })
  })

  it('handles fetch error', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    renderWithTheme(<FilterPanel imageId="test-123" />)
    const applyButton = screen.getByText('Aplicar Filtro')
    fireEvent.click(applyButton)

    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith('Error al aplicar el filtro')
    })
  })

  it('toggles invert button', () => {
    renderWithTheme(<FilterPanel imageId="test-123" />)
    const invertButton = screen.getByText('Invertir')
    fireEvent.click(invertButton)
    expect(invertButton).toHaveAttribute('aria-pressed', 'true')
  })
})
