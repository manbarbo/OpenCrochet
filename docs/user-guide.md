# OpenCrochet User Guide

## Getting Started

### Overview

OpenCrochet is a web application that converts images into filet crochet patterns. The process involves three main steps:

1. **Upload** an image
2. **Apply filters** to optimize the image for crochet
3. **Generate a grid** and export the pattern

### Accessing the Application

1. Open your web browser
2. Navigate to `http://localhost:3000` (or the deployed URL)
3. The application will load with the upload step ready

---

## Step 1: Upload Image

### Supported Formats

- **JPG/JPEG** — Most common format, good for photos
- **PNG** — Best for images with transparency or sharp edges
- **WebP** — Modern format with good compression

### Upload Methods

**Method 1: Drag and Drop**
1. Drag an image file from your computer
2. Drop it onto the upload area
3. The image will be selected automatically

**Method 2: Click to Browse**
1. Click the upload area
2. Select an image file from the file picker
3. Click "Open" or "Select"

### Validation Rules

- **File size**: Maximum 10MB
- **File types**: Only JPG, PNG, and WebP are accepted
- **Dimensions**: Images are automatically resized for processing

### After Upload

- A preview of the uploaded image will appear
- Click "Subir imagen" to upload to the server
- On success, the app will proceed to the filter step

---

## Step 2: Apply Filters

### Available Filters

#### Threshold (Default)

Converts the image to pure black and white based on a luminosity threshold.

- **Threshold**: Controls the cutoff point (0-255)
  - Lower values = more white
  - Higher values = more black
  - Default: 128
- **Invert**: Reverses the black/white areas

**Best for**: Images with clear light/dark contrast

#### Halftone

Creates a dot pattern effect similar to newspaper printing.

- **Dot Size**: Controls the size of the halftone dots (1-20px)
  - Smaller dots = more detail
  - Larger dots = more abstract
  - Default: 4px

**Best for**: Artistic patterns and gradual tone transitions

#### Posterize

Reduces the number of colors to create a poster-like effect.

- **Levels**: Number of color levels (2-256)
  - 2 levels = pure black and white
  - More levels = more tonal variation
  - Default: 2

**Best for**: Simplifying complex images with many colors

#### Pixelate

Reduces image resolution to create a pixel art effect.

- **Block Size**: Size of each pixel block (1-100px)
  - Smaller blocks = more detail
  - Larger blocks = more abstract
  - Default: 10px

**Best for**: Creating grid-like patterns from any image

### Applying Filters

1. Select a filter type from the toggle buttons
2. Adjust the parameters using the slider
3. Click "Aplicar Filtro" to apply
4. The processed image will appear in the preview
5. Click "Continuar al Grid" to proceed

### Tips

- **Start with Threshold** for most images
- **Use Posterize** for images with complex colors
- **Try Halftone** for artistic effects
- **Pixelate** is great for creating pixel art patterns
- You can change filters and re-apply until you get the desired result

---

## Step 3: Generate Grid

### Grid Dimensions

- **Width**: Number of cells horizontally (5-50)
- **Height**: Number of cells vertically (5-50)
- Default: 20x20

### Adjusting Grid Size

1. Use the sliders to adjust width and height
2. Consider the complexity of your image:
   - **Smaller grids** (10x10) = simpler patterns, easier to crochet
   - **Larger grids** (30x30+) = more detail, more complex patterns

### Generating the Grid

1. Adjust grid dimensions as needed
2. Click "Generar Grid"
3. The grid will appear showing the pattern

### Grid Interpretation

- **Black cells** = Fill the cell (crochet stitch)
- **White cells** = Leave empty (open mesh)

---

## Export Pattern

### Export Formats

#### SVG (Scalable Vector Graphics)
- **Best for**: Digital viewing, scaling, printing
- **Pros**: Vector format, scales to any size
- **Cons**: Requires vector graphics software to edit

#### PNG (Portable Network Graphics)
- **Best for**: Sharing, digital viewing
- **Pros**: Pixel-perfect, works everywhere
- **Cons**: Fixed resolution

#### PDF (Portable Document Format)
- **Best for**: Printing, sharing documents
- **Pros**: Universal format, includes text instructions
- **Cons**: Text-only, not visual

### Export Process

1. Select the desired format from the toggle buttons
2. Click "Exportar Patrón"
3. The file will download automatically

### File Naming

- SVG: `pattern.svg`
- PNG: `export-{timestamp}.png`
- PDF: Text output shown in console

---

## Tips for Best Results

### Image Selection

- **High contrast** images work best
- **Simple subjects** are easier to convert
- **Avoid** very busy or detailed images
- **Portraits** work well with Threshold or Halftone
- **Landscapes** may need Posterize or Pixelate

### Filter Selection Guide

| Image Type | Recommended Filter | Reason |
|------------|-------------------|--------|
| Black & white photo | Threshold | Already has good contrast |
| Color photo | Posterize | Reduces color complexity |
| Drawing/illustration | Threshold | Clear lines and shapes |
| Gradient/artistic | Halftone | Preserves tonal variation |
| Any image | Pixelate | Simple grid conversion |

### Grid Size Guidelines

| Project Type | Recommended Grid | Difficulty |
|-------------|-------------------|------------|
| Small doily | 10x10 - 15x15 | Beginner |
| Pillow cover | 20x20 - 25x25 | Intermediate |
| Wall hanging | 30x30 - 40x40 | Advanced |
| Blanket | 40x40+ | Expert |

### Crochet Tips

- Each grid cell typically represents one filet crochet block
- Use cotton thread for best results
- Block your finished piece to maintain shape
- Consider the negative space (white cells) as part of the design

---

## Troubleshooting

### Common Issues

**"Solo se permiten archivos JPG, PNG o WebP"**
- Solution: Convert your image to one of the supported formats

**"El archivo no debe superar los 10MB"**
- Solution: Compress the image or reduce its dimensions

**"Error al subir la imagen"**
- Solution: Check your internet connection and try again

**"Error al aplicar el filtro"**
- Solution: The image may be corrupted. Try uploading a different image.

**"Error al generar el grid"**
- Solution: Make sure you have applied a filter first

### Performance Tips

- **Large images** take longer to process
- **High grid dimensions** increase processing time
- **Close other browser tabs** to free up memory
- **Use Chrome or Firefox** for best performance

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Navigate between controls |
| `Space` | Activate buttons |
| `Enter` | Confirm actions |
| `Escape` | Cancel or close dialogs |

---

## Accessibility

OpenCrochet is designed to be accessible:

- **Keyboard navigation** supported throughout
- **Screen reader** compatible
- **High contrast** mode available
- **ARIA labels** on all interactive elements
- **Focus indicators** visible

---

## Support

For issues, questions, or suggestions:

- **GitHub Issues**: https://github.com/manuelbarona/opencrochet/issues
- **Documentation**: See README.md and API docs
- **Storybook**: Visit `http://localhost:6006` for component documentation

---

**Last Updated:** 2026-06-11
**Version:** 1.0.0
