import { useState, useCallback } from 'react'
import { Box, Button, Typography, Paper, Alert, CircularProgress } from '@mui/material'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'
import { uploadImage } from '../services/api'

interface ImageUploaderProps {
  onUpload?: (imageId: string) => void
}

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const validateAndSetFile = useCallback((file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Solo se permiten archivos JPG, PNG o WebP')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo no debe superar los 10MB')
      return
    }
    setError(null)
    setFile(file)
    setSuccess(false)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      validateAndSetFile(droppedFile)
    }
  }, [validateAndSetFile])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }, [validateAndSetFile])

  const handleUpload = async () => {
    if (!file) return
    
    setLoading(true)
    setError(null)
    try {
      const response = await uploadImage(file)
      setSuccess(true)
      if (onUpload && response?.file?.filename) {
        onUpload(response.file.filename)
      }
    } catch {
      setError('Error al subir la imagen. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        OpenCrochet
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Sube una imagen para convertirla en un patrón de crochet filet
      </Typography>

      <Paper
        variant="outlined"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        sx={{
          p: 4,
          textAlign: 'center',
          border: dragActive ? '2px dashed #1976d2' : '2px dashed #ccc',
          bgcolor: dragActive ? 'rgba(25, 118, 210, 0.04)' : 'background.paper',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
        }}
      >
        <input
          type="file"
          id="file-upload"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          style={{ display: 'none' }}
          data-testid="file-input"
        />
        <label htmlFor="file-upload">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CloudUploadIcon sx={{ fontSize: 48, color: dragActive ? 'primary.main' : 'text.secondary' }} />
            <Typography variant="h6" component="h2">
              {dragActive ? 'Suelta la imagen aquí' : 'Arrastra y suelta una imagen'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              o haz clic para seleccionar un archivo
            </Typography>
            <Typography variant="caption" color="text.secondary">
              JPG, PNG, WebP (máx. 10MB)
            </Typography>
          </Box>
        </label>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {preview && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Vista previa:
          </Typography>
          <Box
            component="img"
            src={preview}
            alt="Preview"
            sx={{
              maxWidth: '100%',
              maxHeight: 300,
              borderRadius: 1,
              boxShadow: 1,
            }}
          />
          <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Subiendo...' : 'Subir imagen'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setFile(null)
                setPreview(null)
                setError(null)
                setSuccess(false)
              }}
            >
              Eliminar
            </Button>
          </Box>
        </Box>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          ¡Imagen subida exitosamente!
        </Alert>
      )}
    </Box>
  )
}
