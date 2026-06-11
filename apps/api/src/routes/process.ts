import { Router } from 'express'

const router = Router()

router.post('/threshold', (req, res) => {
  res.json({ message: 'Threshold filter endpoint' })
})

router.post('/halftone', (req, res) => {
  res.json({ message: 'Halftone filter endpoint' })
})

router.post('/posterize', (req, res) => {
  res.json({ message: 'Posterize filter endpoint' })
})

router.post('/pixelate', (req, res) => {
  res.json({ message: 'Pixelate filter endpoint' })
})

export { router as processRouter }
