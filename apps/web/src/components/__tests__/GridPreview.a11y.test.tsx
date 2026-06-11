import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { axe, toHaveNoViolations } from 'jest-axe'
import GridPreview from '../GridPreview'

expect.extend(toHaveNoViolations)

const theme = createTheme()

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('GridPreview Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = renderWithTheme(<GridPreview imageId="test-123.png" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('range inputs should have accessible labels', () => {
    renderWithTheme(<GridPreview imageId="test-123.png" />)
    
    const rangeInputs = screen.getAllByRole('slider')
    expect(rangeInputs).toHaveLength(2)
    
    rangeInputs.forEach(input => {
      expect(input).toHaveAttribute('min')
      expect(input).toHaveAttribute('max')
    })
  })

  it('generate grid button should have accessible name', () => {
    renderWithTheme(<GridPreview imageId="test-123.png" />)
    
    const generateButton = screen.getByRole('button', { name: 'Generar Grid' })
    expect(generateButton).toBeInTheDocument()
  })

  it('should have no accessibility violations with grid generated', async () => {
    const mockGrid = [[0, 1], [1, 0]]
    const { container } = renderWithTheme(<GridPreview imageId="test-123.png" />)
    
    // Generate grid
    const generateButton = screen.getByRole('button', { name: 'Generar Grid' })
    fireEvent.click(generateButton)
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
