import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { axe, toHaveNoViolations } from 'jest-axe'
import ImagePreview from '../ImagePreview'

expect.extend(toHaveNoViolations)

const theme = createTheme()

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('ImagePreview Accessibility', () => {
  it('should have no accessibility violations with original image', async () => {
    const { container } = renderWithTheme(
      <ImagePreview
        originalImageId="test.png"
        showOriginal={true}
        showProcessed={false}
        title="Original Image"
      />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have no accessibility violations with processed image', async () => {
    const { container } = renderWithTheme(
      <ImagePreview
        originalImageId="test.png"
        processedImageUrl="processed.png"
        showOriginal={false}
        showProcessed={true}
        title="Processed Image"
      />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have no accessibility violations with both images', async () => {
    const { container } = renderWithTheme(
      <ImagePreview
        originalImageId="test.png"
        processedImageUrl="processed.png"
        showOriginal={true}
        showProcessed={true}
        title="Before & After"
      />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('images should have alt text', () => {
    renderWithTheme(
      <ImagePreview
        originalImageId="test.png"
        processedImageUrl="processed.png"
        showOriginal={true}
        showProcessed={true}
        title="Test"
      />
    )
    
    const images = screen.getAllByRole('img')
    images.forEach(img => {
      expect(img).toHaveAttribute('alt')
    })
  })
})
