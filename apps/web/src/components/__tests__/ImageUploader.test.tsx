import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import ImageUploader from '../ImageUploader'

const theme = createTheme()

jest.mock('../../services/api', () => ({
  uploadImage: jest.fn(),
}))

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('ImageUploader', () => {
  const mockOnUpload = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders upload area', () => {
    renderWithTheme(<ImageUploader />)
    expect(screen.getByText('OpenCrochet')).toBeInTheDocument()
    expect(screen.getByText('Arrastra y suelta una imagen')).toBeInTheDocument()
  })

  it('shows file input', () => {
    renderWithTheme(<ImageUploader />)
    const fileInput = screen.getByTestId('file-input')
    expect(fileInput).toBeInTheDocument()
    expect(fileInput).toHaveAttribute('type', 'file')
  })

  it('handles file selection', async () => {
    renderWithTheme(<ImageUploader />)
    const fileInput = screen.getByTestId('file-input')
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    await waitFor(() => {
      expect(screen.getByText('Vista previa:')).toBeInTheDocument()
    })
  })

  it('shows error for invalid file type', () => {
    renderWithTheme(<ImageUploader />)
    const fileInput = screen.getByTestId('file-input')
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    expect(screen.getByText('Solo se permiten archivos JPG, PNG o WebP')).toBeInTheDocument()
  })

  it('shows error for file too large', () => {
    renderWithTheme(<ImageUploader />)
    const fileInput = screen.getByTestId('file-input')
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.png', { type: 'image/png' })
    
    Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 })
    
    fireEvent.change(fileInput, { target: { files: [largeFile] } })
    
    expect(screen.getByText('El archivo no debe superar los 10MB')).toBeInTheDocument()
  })

  it('clears file when remove button is clicked', async () => {
    renderWithTheme(<ImageUploader />)
    const fileInput = screen.getByTestId('file-input')
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    await waitFor(() => {
      expect(screen.getByText('Vista previa:')).toBeInTheDocument()
    })
    
    const removeButton = screen.getByText('Eliminar')
    fireEvent.click(removeButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Vista previa:')).not.toBeInTheDocument()
    })
  })

  it('handles drag enter and leave', () => {
    renderWithTheme(<ImageUploader />)
    const dropZone = screen.getByText('Arrastra y suelta una imagen').closest('div')?.parentElement
    
    if (dropZone) {
      fireEvent.dragEnter(dropZone)
      expect(screen.getByText('Suelta la imagen aquí')).toBeInTheDocument()
      
      fireEvent.dragLeave(dropZone)
      expect(screen.getByText('Arrastra y suelta una imagen')).toBeInTheDocument()
    }
  })

  it('handles drop event', async () => {
    renderWithTheme(<ImageUploader />)
    const dropZone = screen.getByText('Arrastra y suelta una imagen').closest('div')?.parentElement
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    
    if (dropZone) {
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [file],
        },
      })
      
      await waitFor(() => {
        expect(screen.getByText('Vista previa:')).toBeInTheDocument()
      })
    }
  })

  it('handles upload successfully', async () => {
    const { uploadImage } = require('../../services/api')
    uploadImage.mockResolvedValueOnce({
      file: { filename: 'uploaded-test.png' },
    })

    renderWithTheme(<ImageUploader onUpload={mockOnUpload} />)
    const fileInput = screen.getByTestId('file-input')
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    await waitFor(() => {
      expect(screen.getByText('Subir imagen')).toBeInTheDocument()
    })
    
    const uploadButton = screen.getByText('Subir imagen')
    fireEvent.click(uploadButton)
    
    await waitFor(() => {
      expect(screen.getByText('¡Imagen subida exitosamente!')).toBeInTheDocument()
    })
    
    expect(mockOnUpload).toHaveBeenCalledWith('uploaded-test.png')
  })

  it('handles upload error', async () => {
    const { uploadImage } = require('../../services/api')
    uploadImage.mockRejectedValueOnce(new Error('Upload failed'))

    renderWithTheme(<ImageUploader />)
    const fileInput = screen.getByTestId('file-input')
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    await waitFor(() => {
      expect(screen.getByText('Subir imagen')).toBeInTheDocument()
    })
    
    const uploadButton = screen.getByText('Subir imagen')
    fireEvent.click(uploadButton)
    
    await waitFor(() => {
      expect(screen.getByText('Error al subir la imagen. Inténtalo de nuevo.')).toBeInTheDocument()
    })
  })
})
