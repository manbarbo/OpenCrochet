import { Router } from 'express'
import multer from 'multer'

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and WebP are allowed.'))
    }
  },
})

const router = Router()

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: { message: 'No file uploaded', code: 'NO_FILE' } })
  }
  
  res.json({
    success: true,
    file: {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    },
  })
})

export { router as uploadRouter }
