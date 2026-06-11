import { Container, Typography, Box } from '@mui/material'

function App() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h1" component="h1" gutterBottom>
          OpenCrochet
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Convert images into filet crochet patterns
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload an image, apply filters, and generate your crochet pattern.
        </Typography>
      </Box>
    </Container>
  )
}

export default App
