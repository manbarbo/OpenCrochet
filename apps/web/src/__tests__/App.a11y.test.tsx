import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { axe, toHaveNoViolations } from 'jest-axe'
import App from '../App'

expect.extend(toHaveNoViolations)

const theme = createTheme()

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('App Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = renderWithTheme(<App />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have proper heading structure', () => {
    renderWithTheme(<App />)
    
    const h1Elements = screen.getAllByRole('heading', { level: 1 })
    expect(h1Elements).toHaveLength(2)
    expect(h1Elements[0]).toHaveTextContent('OpenCrochet')
    
    const h2Elements = screen.getAllByRole('heading', { level: 2 })
    expect(h2Elements.length).toBeGreaterThan(0)
  })

  it('stepper should have proper aria labels', () => {
    renderWithTheme(<App />)
    
    const stepper = screen.getByRole('list')
    expect(stepper).toHaveClass('MuiStepper-root')
  })
})
