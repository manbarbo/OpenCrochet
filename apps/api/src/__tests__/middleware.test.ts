import { errorHandler } from '../middleware/errorHandler'
import { Request, Response, NextFunction } from 'express'

describe('errorHandler', () => {
  it('should handle errors with message', () => {
    const mockError = new Error('Test error')
    const mockReq = {} as Request
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response
    const mockNext = jest.fn() as NextFunction

    errorHandler(mockError, mockReq, mockRes, mockNext)

    expect(mockRes.status).toHaveBeenCalledWith(500)
    expect(mockRes.json).toHaveBeenCalledWith({
      error: {
        message: 'Test error',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    })
  })

  it('should handle errors without message', () => {
    const mockError = new Error()
    const mockReq = {} as Request
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response
    const mockNext = jest.fn() as NextFunction

    errorHandler(mockError, mockReq, mockRes, mockNext)

    expect(mockRes.status).toHaveBeenCalledWith(500)
    expect(mockRes.json).toHaveBeenCalledWith({
      error: {
        message: 'Internal Server Error',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    })
  })
})
