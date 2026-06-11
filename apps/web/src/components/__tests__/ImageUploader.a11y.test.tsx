import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { axe, toHaveNoViolations } from 'jest-axe'
import ImageUploader from '../ImageUploader'

expect.extend(toHaveNoViolations)

const theme = createTheme()

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('ImageUploader Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = renderWithTheme(<ImageUploader />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('file input should have accessible label', () => {
    renderWithTheme(<ImageUploader />)
    const fileInput = screen.getByTestId('file-input')
    expect(fileInput).toHaveAttribute('id', 'file-upload')
    const label = document.querySelector('label[for="file-upload"]')
    expect(label).toBeInTheDocument()
  })

  it('should have accessible error messages', async () => {
    renderWithTheme(<ImageUploader />)
    const fileInput = screen.getByTestId('file-input')
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' })
    
    fireEvent.change(fileInput, { target: { files: [invalidFile] } })
    
    const errorAlert = await screen.findByRole('alert')
    expect(errorAlert).toHaveTextContent('Solo se permiten archivos JPG, PNG o WebP')
  })

  it('buttons should have accessible names', async () => {
    renderWithTheme(<ImageUploader />)
    const fileInput = screen.getByTestId('file-input')
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    await waitFor(() => {
      const uploadButton = screen.getByRole('button', { name: /Subir/i })
      expect(uploadButton).toBeInTheDocument()
    })
    
    const removeButton = screen.getByRole('button', { name: /Eliminar/i })
    expect(removeButton).toBeInTheDocument()
  })
})
