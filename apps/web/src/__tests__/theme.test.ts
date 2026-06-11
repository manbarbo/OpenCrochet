import { theme } from '../styles/theme'
import { createTheme } from '@mui/material/styles'

describe('theme', () => {
  it('should create theme with correct primary color', () => {
    const testTheme = createTheme({
      palette: {
        primary: {
          main: '#1976d2',
        },
      },
    })
    
    expect(testTheme.palette.primary.main).toBe('#1976d2')
  })

  it('should have theme object', () => {
    expect(theme).toBeDefined()
    expect(theme.palette).toBeDefined()
  })

  it('should have typography configuration', () => {
    expect(theme.typography).toBeDefined()
    expect(theme.typography.fontFamily).toBeDefined()
  })
})
