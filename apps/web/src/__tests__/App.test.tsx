import { render, screen, act, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import App from '../App'

const theme = createTheme()

const mockState = {
  uploadedImage: null,
  processedImage: null,
  error: null,
}

const mockSetUploadedImage = jest.fn((image) => {
  mockState.uploadedImage = image
})
const mockSetProcessedImage = jest.fn((image) => {
  mockState.processedImage = image
})
const mockSetCurrentFilter = jest.fn()
const mockSetGrid = jest.fn()
const mockSetError = jest.fn((error) => {
  mockState.error = error
})

jest.mock('../stores/appStore', () => ({
  useAppStore: jest.fn(() => ({
    uploadedImage: mockState.uploadedImage,
    processedImage: mockState.processedImage,
    error: mockState.error,
    setUploadedImage: mockSetUploadedImage,
    setProcessedImage: mockSetProcessedImage,
    setCurrentFilter: mockSetCurrentFilter,
    setGrid: mockSetGrid,
    setError: mockSetError,
  })),
}))

// Mock all child components
jest.mock('../components/ImageUploader', () => {
  return function MockImageUploader({ onUpload }: any) {
    return (
      <div data-testid="mock-image-uploader">
        <button onClick={() => onUpload && onUpload('test-image-123')}>
          Upload Mock
        </button>
      </div>
    )
  }
})

jest.mock('../components/FilterPanel', () => {
  return function MockFilterPanel({ imageId }: any) {
    return <div data-testid="mock-filter-panel">FilterPanel: {imageId}</div>
  }
})

jest.mock('../components/GridPreview', () => {
  return function MockGridPreview({ imageId }: any) {
    return <div data-testid="mock-grid-preview">GridPreview: {imageId}</div>
  }
})

jest.mock('../components/ImagePreview', () => {
  return function MockImagePreview(props: any) {
    return <div data-testid="mock-image-preview">ImagePreview</div>
  }
})

const renderWithTheme = (component: React.ReactElement) => {
  const result = render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
  return {
    ...result,
    rerender: (newComponent: React.ReactElement) => {
      result.rerender(
        <ThemeProvider theme={theme}>
          {newComponent}
        </ThemeProvider>
      )
    },
  }
}

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the app with title and stepper', () => {
    renderWithTheme(<App />)
    expect(screen.getByText('OpenCrochet')).toBeInTheDocument()
    expect(screen.getByText('Subir Imagen')).toBeInTheDocument()
    expect(screen.getByText('Aplicar Filtro')).toBeInTheDocument()
    expect(screen.getByText('Generar Grid')).toBeInTheDocument()
  })

  it('starts with upload step', () => {
    renderWithTheme(<App />)
    expect(screen.getByTestId('mock-image-uploader')).toBeInTheDocument()
  })

  it('advances to filter step after upload', async () => {
    const { rerender } = renderWithTheme(<App />)
    const uploadButton = screen.getByText('Upload Mock')
    
    await act(async () => {
      uploadButton.click()
    })
    
    // Re-render to reflect the updated state
    rerender(<App />)
    
    await waitFor(() => {
      expect(screen.getByTestId('mock-filter-panel')).toBeInTheDocument()
    })
  })

  it('has reset button in filter step', async () => {
    const { rerender } = renderWithTheme(<App />)
    const uploadButton = screen.getByText('Upload Mock')
    
    await act(async () => {
      uploadButton.click()
    })
    
    // Re-render to reflect the updated state
    rerender(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('Reiniciar')).toBeInTheDocument()
    })
  })

  it('advances to grid step after filter applied', async () => {
    const { rerender } = renderWithTheme(<App />)
    const uploadButton = screen.getByText('Upload Mock')
    
    await act(async () => {
      uploadButton.click()
    })
    
    // Re-render to reflect the updated state
    rerender(<App />)
    
    await waitFor(() => {
      expect(screen.getByTestId('mock-filter-panel')).toBeInTheDocument()
    })
    
    // Simulate processed image being set
    mockState.processedImage = 'processed-test.png'
    rerender(<App />)
    
    const continueButton = screen.getByText('Continuar al Grid')
    await act(async () => {
      continueButton.click()
    })
    
    rerender(<App />)
    
    await waitFor(() => {
      expect(screen.getByTestId('mock-grid-preview')).toBeInTheDocument()
    })
  })

  it('resets to upload step from filter step', async () => {
    const { rerender } = renderWithTheme(<App />)
    const uploadButton = screen.getByText('Upload Mock')
    
    await act(async () => {
      uploadButton.click()
    })
    
    rerender(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('Reiniciar')).toBeInTheDocument()
    })
    
    const resetButton = screen.getByText('Reiniciar')
    await act(async () => {
      resetButton.click()
    })
    
    rerender(<App />)
    
    await waitFor(() => {
      expect(screen.getByTestId('mock-image-uploader')).toBeInTheDocument()
    })
  })

  it('resets to upload step from grid step', async () => {
    const { rerender } = renderWithTheme(<App />)
    const uploadButton = screen.getByText('Upload Mock')
    
    await act(async () => {
      uploadButton.click()
    })
    
    rerender(<App />)
    
    // Simulate processed image being set
    mockState.processedImage = 'processed-test.png'
    rerender(<App />)
    
    const continueButton = screen.getByText('Continuar al Grid')
    await act(async () => {
      continueButton.click()
    })
    
    rerender(<App />)
    
    await waitFor(() => {
      expect(screen.getByTestId('mock-grid-preview')).toBeInTheDocument()
    })
    
    const resetButton = screen.getByText('Nueva imagen')
    await act(async () => {
      resetButton.click()
    })
    
    rerender(<App />)
    
    await waitFor(() => {
      expect(screen.getByTestId('mock-image-uploader')).toBeInTheDocument()
    })
  })

  it('displays error message when error exists', async () => {
    mockState.error = 'Test error message'
    renderWithTheme(<App />)
    
    expect(screen.getByText('Test error message')).toBeInTheDocument()
    
    // Reset error state
    mockState.error = null
  })
})
