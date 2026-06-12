import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import App from '../App'
import { uploadImage } from '../services/api'

const theme = createTheme()

jest.mock('../services/api', () => ({
  uploadImage: jest.fn(),
}))

const mockUploadImage = uploadImage as jest.Mock

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('E2E: Critical User Flows', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
    global.URL.createObjectURL = jest.fn(() => 'mock-url')
    global.URL.revokeObjectURL = jest.fn()
    mockUploadImage.mockReset()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('complete flow: upload -> filter -> grid -> export', async () => {
    mockUploadImage.mockResolvedValueOnce({
      success: true,
      file: { filename: 'test-123.png', originalname: 'test.png', mimetype: 'image/png', size: 1024 }
    })

    // Mock fetch for filter, grid, and export
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ processedImageUrl: '/uploads/processed-test-123.png' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ grid: [[0, 1], [1, 0]] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        blob: async () => new Blob(['svg content'], { type: 'image/svg+xml' }),
      })

    renderWithTheme(<App />)

    // Step 1: Upload image
    const fileInput = screen.getByTestId('file-input')
    const file = new File(['test-image'], 'test.png', { type: 'image/png' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })

    // Wait for preview to appear (FileReader is async)
    await waitFor(() => {
      expect(screen.getByText('Vista previa:')).toBeInTheDocument()
    })

    // Click upload button
    const uploadButton = screen.getByText('Subir imagen')
    await act(async () => {
      uploadButton.click()
    })

    // Wait for filter step
    await waitFor(() => {
      expect(screen.getByText('Continuar al Grid')).toBeInTheDocument()
    })

    // Step 2: Apply filter - use role to get the button specifically
    const applyFilterButton = screen.getByRole('button', { name: 'Aplicar Filtro' })
    await act(async () => {
      applyFilterButton.click()
    })

    await waitFor(() => {
      expect(screen.getByText('Continuar al Grid')).not.toBeDisabled()
    })

    // Step 3: Continue to grid
    const continueButton = screen.getByText('Continuar al Grid')
    await act(async () => {
      continueButton.click()
    })

    // Wait for grid step - use role to get button specifically
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Generar Grid' })).toBeInTheDocument()
    })

    // Step 4: Generate grid - use role to get button specifically
    const generateGridButton = screen.getByRole('button', { name: 'Generar Grid' })
    await act(async () => {
      generateGridButton.click()
    })

    await waitFor(() => {
      expect(screen.getByText('Exportar Patrón')).toBeInTheDocument()
    })

    // Step 5: Export pattern
    const exportButton = screen.getByText(/Exportar como/)
    await act(async () => {
      exportButton.click()
    })
  })

  it('E2E: user can reset and start over', async () => {
    mockUploadImage.mockResolvedValueOnce({
      success: true,
      file: { filename: 'test-123.png', originalname: 'test.png', mimetype: 'image/png', size: 1024 }
    })

    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ processedImageUrl: '/uploads/processed-test-123.png' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ grid: [[0, 1], [1, 0]] }),
      })

    renderWithTheme(<App />)

    // Upload image
    const fileInput = screen.getByTestId('file-input')
    const file = new File(['test-image'], 'test.png', { type: 'image/png' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })

    // Wait for preview to appear
    await waitFor(() => {
      expect(screen.getByText('Vista previa:')).toBeInTheDocument()
    })

    const uploadButton = screen.getByText('Subir imagen')
    await act(async () => {
      uploadButton.click()
    })

    await waitFor(() => {
      expect(screen.getByText('Reiniciar')).toBeInTheDocument()
    })

    // Apply filter - use role to get button specifically
    const applyFilterButton = screen.getByRole('button', { name: 'Aplicar Filtro' })
    await act(async () => {
      applyFilterButton.click()
    })

    await waitFor(() => {
      expect(screen.getByText('Continuar al Grid')).not.toBeDisabled()
    })

    // Continue to grid
    const continueButton = screen.getByText('Continuar al Grid')
    await act(async () => {
      continueButton.click()
    })

    await waitFor(() => {
      expect(screen.getByText('Nueva imagen')).toBeInTheDocument()
    })

    // Reset
    const resetButton = screen.getByText('Nueva imagen')
    await act(async () => {
      resetButton.click()
    })

    // After reset, we should be back at the initial upload step
    await waitFor(() => {
      expect(screen.getByText('Arrastra y suelta una imagen')).toBeInTheDocument()
    })
  })

  it('E2E: error handling during upload', async () => {
    mockUploadImage.mockRejectedValueOnce(new Error('Network error'))

    renderWithTheme(<App />)

    const fileInput = screen.getByTestId('file-input')
    const file = new File(['test-image'], 'test.png', { type: 'image/png' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })

    // Wait for preview to appear
    await waitFor(() => {
      expect(screen.getByText('Vista previa:')).toBeInTheDocument()
    })

    const uploadButton = screen.getByText('Subir imagen')
    await act(async () => {
      uploadButton.click()
    })

    await waitFor(() => {
      expect(screen.getByText('Error al subir la imagen. Inténtalo de nuevo.')).toBeInTheDocument()
    })
  })

  it('E2E: filter application error handling', async () => {
    mockUploadImage.mockResolvedValueOnce({
      success: true,
      file: { filename: 'test-123.png', originalname: 'test.png', mimetype: 'image/png', size: 1024 }
    })
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    })

    renderWithTheme(<App />)

    // Upload
    const fileInput = screen.getByTestId('file-input')
    const file = new File(['test-image'], 'test.png', { type: 'image/png' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })

    // Wait for preview to appear
    await waitFor(() => {
      expect(screen.getByText('Vista previa:')).toBeInTheDocument()
    })

    const uploadButton = screen.getByText('Subir imagen')
    await act(async () => {
      uploadButton.click()
    })

    // Wait for filter step
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Aplicar Filtro' })).toBeInTheDocument()
    })

    // Apply filter (should fail) - use role to get button specifically
    const applyFilterButton = screen.getByRole('button', { name: 'Aplicar Filtro' })
    await act(async () => {
      applyFilterButton.click()
    })

    await waitFor(() => {
      expect(screen.getByText('Error al aplicar el filtro')).toBeInTheDocument()
    })
  })
})
