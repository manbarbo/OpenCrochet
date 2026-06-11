const mockPost = jest.fn()

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      post: mockPost,
      defaults: { baseURL: '/api' },
    })),
  },
}))

import { uploadImage } from '../services/api'

describe('api service', () => {
  beforeEach(() => {
    mockPost.mockReset()
  })

  it('should upload image successfully', async () => {
    mockPost.mockResolvedValueOnce({ data: { success: true } })
    
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    
    const result = await uploadImage(file)
    
    expect(result.success).toBe(true)
    expect(mockPost).toHaveBeenCalledWith('/upload', expect.any(FormData), {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  })

  it('should handle upload error', async () => {
    mockPost.mockRejectedValueOnce(new Error('Upload failed'))
    
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    
    await expect(uploadImage(file)).rejects.toThrow('Upload failed')
  })
})
