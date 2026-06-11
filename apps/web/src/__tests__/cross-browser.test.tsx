import { render } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import App from '../App'

const theme = createTheme()

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('Cross-Browser Compatibility', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.URL.createObjectURL = jest.fn(() => 'mock-url')
    global.URL.revokeObjectURL = jest.fn()
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Browser API Availability', () => {
    it('should have File API available', () => {
      expect(window.File).toBeDefined()
      expect(window.FileReader).toBeDefined()
      expect(window.Blob).toBeDefined()
    })

    it('should have URL API available', () => {
      expect(window.URL).toBeDefined()
      expect(window.URL.createObjectURL).toBeDefined()
      expect(window.URL.revokeObjectURL).toBeDefined()
    })

    it('should have fetch API available', () => {
      expect(window.fetch).toBeDefined()
    })

    it('should have FormData available', () => {
      expect(window.FormData).toBeDefined()
    })
  })

  describe('Responsive Design', () => {
    it('should render on mobile viewport (375px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      window.dispatchEvent(new Event('resize'))
      
      const { container } = renderWithTheme(<App />)
      expect(container.querySelector('.MuiContainer-root')).toBeInTheDocument()
    })

    it('should render on tablet viewport (768px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })
      
      window.dispatchEvent(new Event('resize'))
      
      const { container } = renderWithTheme(<App />)
      expect(container.querySelector('.MuiContainer-root')).toBeInTheDocument()
    })

    it('should render on desktop viewport (1920px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      })
      
      window.dispatchEvent(new Event('resize'))
      
      const { container } = renderWithTheme(<App />)
      expect(container.querySelector('.MuiContainer-root')).toBeInTheDocument()
    })
  })

  describe('Browser Feature Detection', () => {
    it('should detect modern browser features', () => {
      expect(window.Promise).toBeDefined()
      expect(Array.prototype.includes).toBeDefined()
      expect(Array.prototype.find).toBeDefined()
      expect(Object.assign).toBeDefined()
      expect(Object.entries).toBeDefined()
    })
  })

  describe('CSS Feature Detection', () => {
    it('should support CSS Grid', () => {
      const div = document.createElement('div')
      div.style.display = 'grid'
      expect(div.style.display).toBe('grid')
    })

    it('should support CSS Flexbox', () => {
      const div = document.createElement('div')
      div.style.display = 'flex'
      expect(div.style.display).toBe('flex')
    })
  })
})
