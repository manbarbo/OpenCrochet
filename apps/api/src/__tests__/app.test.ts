import request from 'supertest'
import { app } from '../app'

describe('app', () => {
  it('should respond to health check', async () => {
    const response = await request(app).get('/health')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('ok')
  })

  it('should handle 404 for unknown routes', async () => {
    const response = await request(app).get('/api/unknown')
    expect(response.status).toBe(404)
  })

  it('should have json parser', async () => {
    const response = await request(app)
      .post('/api/process/threshold')
      .send({ test: 'data' })
    
    // Route exists, returns 400 for missing required fields
    expect(response.status).toBe(400)
  })

  it('should handle errors', async () => {
    const response = await request(app)
      .get('/api/upload')
      .set('Accept', 'application/json')
    
    // Route exists but GET returns 404 since only POST is defined
    expect(response.status).toBe(404)
  })
})
