import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import GridPreview from '../GridPreview'

const theme = createTheme()

jest.mock('../../stores/appStore', () => ({
  useAppStore: jest.fn(() => ({
    processedImage: '/uploads/processed-test.png',
  })),
}))

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('GridPreview', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
    global.URL.createObjectURL = jest.fn(() => 'mock-url')
    global.URL.revokeObjectURL = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders grid preview controls', () => {
    renderWithTheme(<GridPreview imageId="test-123" />)
    expect(screen.getByText('Vista del Grid')).toBeInTheDocument()
    expect(screen.getByText(/Ancho:/)).toBeInTheDocument()
    expect(screen.getByText(/Alto:/)).toBeInTheDocument()
  })

  it('generates grid successfully', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ grid: [[0, 1], [1, 0]] }),
    })

    renderWithTheme(<GridPreview imageId="test-123" />)
    const generateButton = screen.getByText('Generar Grid')
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(screen.getByText('Exportar Patrón')).toBeInTheDocument()
    })
  })

  it('handles grid generation error', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    })

    renderWithTheme(<GridPreview imageId="test-123" />)
    const generateButton = screen.getByText('Generar Grid')
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(generateButton).not.toBeDisabled()
    })
  })

  it('handles fetch error during grid generation', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    renderWithTheme(<GridPreview imageId="test-123" />)
    const generateButton = screen.getByText('Generar Grid')
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(generateButton).not.toBeDisabled()
    })
  })

  it('exports SVG pattern successfully', async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ grid: [[0, 1], [1, 0]] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        blob: async () => new Blob(['svg content'], { type: 'image/svg+xml' }),
      })

    renderWithTheme(<GridPreview imageId="test-123" />)
    
    const generateButton = screen.getByText('Generar Grid')
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText('Exportar Patrón')).toBeInTheDocument()
    })

    const svgButton = screen.getByText('SVG')
    fireEvent.click(svgButton)

    const exportButton = screen.getByText('Exportar como SVG')
    fireEvent.click(exportButton)

    await waitFor(() => {
      expect(exportButton).not.toBeDisabled()
    })
  })

  it('exports PDF pattern successfully', async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ grid: [[0, 1], [1, 0]] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, pattern: 'XOX\nOXO' }),
      })

    renderWithTheme(<GridPreview imageId="test-123" />)
    
    const generateButton = screen.getByText('Generar Grid')
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText('Exportar Patrón')).toBeInTheDocument()
    })

    const pdfButton = screen.getByText('PDF')
    fireEvent.click(pdfButton)

    const exportButton = screen.getByText('Exportar como PDF')
    fireEvent.click(exportButton)

    await waitFor(() => {
      expect(exportButton).not.toBeDisabled()
    })
  })

  it('changes export format', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ grid: [[0, 1], [1, 0]] }),
    })

    renderWithTheme(<GridPreview imageId="test-123" />)
    
    const generateButton = screen.getByText('Generar Grid')
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText('Exportar Patrón')).toBeInTheDocument()
    })

    const pngButton = screen.getByText('PNG')
    fireEvent.click(pngButton)

    expect(screen.getByText('Exportar como PNG')).toBeInTheDocument()
  })

  it('updates grid dimensions', () => {
    renderWithTheme(<GridPreview imageId="test-123" />)
    
    const widthSlider = screen.getAllByRole('slider')[0]
    const heightSlider = screen.getAllByRole('slider')[1]
    
    fireEvent.change(widthSlider, { target: { value: 30 } })
    fireEvent.change(heightSlider, { target: { value: 25 } })
    
    expect(screen.getByText('Ancho: 30')).toBeInTheDocument()
    expect(screen.getByText('Alto: 25')).toBeInTheDocument()
  })
})
