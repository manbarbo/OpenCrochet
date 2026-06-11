import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { axe, toHaveNoViolations } from 'jest-axe'
import FilterPanel from '../FilterPanel'

expect.extend(toHaveNoViolations)

const theme = createTheme()

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('FilterPanel Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = renderWithTheme(<FilterPanel imageId="test-123.png" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('toggle buttons should have aria-labels', () => {
    renderWithTheme(<FilterPanel imageId="test-123.png" />)
    
    const thresholdButton = screen.getByRole('button', { name: 'threshold' })
    expect(thresholdButton).toHaveAttribute('aria-label', 'threshold')
    
    const halftoneButton = screen.getByRole('button', { name: 'halftone' })
    expect(halftoneButton).toHaveAttribute('aria-label', 'halftone')
    
    const posterizeButton = screen.getByRole('button', { name: 'posterize' })
    expect(posterizeButton).toHaveAttribute('aria-label', 'posterize')
    
    const pixelateButton = screen.getByRole('button', { name: 'pixelate' })
    expect(pixelateButton).toHaveAttribute('aria-label', 'pixelate')
  })

  it('slider should have accessible label', () => {
    renderWithTheme(<FilterPanel imageId="test-123.png" />)
    
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('aria-valuenow')
    expect(slider).toHaveAttribute('aria-valuemin')
    expect(slider).toHaveAttribute('aria-valuemax')
  })

  it('apply filter button should have accessible name', () => {
    renderWithTheme(<FilterPanel imageId="test-123.png" />)
    
    const applyButton = screen.getByRole('button', { name: 'Aplicar Filtro' })
    expect(applyButton).toBeInTheDocument()
  })
})
