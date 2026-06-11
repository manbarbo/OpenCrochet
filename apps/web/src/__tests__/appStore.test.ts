import { useAppStore } from '../stores/appStore'

describe('appStore', () => {
  it('should have initial state', () => {
    const state = useAppStore.getState()
    
    expect(state.uploadedImage).toBeNull()
    expect(state.processedImage).toBeNull()
    expect(state.currentFilter).toBeNull()
    expect(state.grid).toBeNull()
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('should set uploaded image', () => {
    const { setUploadedImage } = useAppStore.getState()
    setUploadedImage('image-123')
    
    expect(useAppStore.getState().uploadedImage).toBe('image-123')
  })

  it('should set processed image', () => {
    const { setProcessedImage } = useAppStore.getState()
    setProcessedImage('processed-123')
    
    expect(useAppStore.getState().processedImage).toBe('processed-123')
  })

  it('should set current filter', () => {
    const { setCurrentFilter } = useAppStore.getState()
    setCurrentFilter('threshold')
    
    expect(useAppStore.getState().currentFilter).toBe('threshold')
  })

  it('should set grid', () => {
    const { setGrid } = useAppStore.getState()
    const testGrid = [[0, 1], [1, 0]]
    setGrid(testGrid)
    
    expect(useAppStore.getState().grid).toEqual(testGrid)
  })

  it('should set loading state', () => {
    const { setIsLoading } = useAppStore.getState()
    setIsLoading(true)
    
    expect(useAppStore.getState().isLoading).toBe(true)
  })

  it('should set error', () => {
    const { setError } = useAppStore.getState()
    setError('Test error')
    
    expect(useAppStore.getState().error).toBe('Test error')
  })

  it('should reset state', () => {
    const { setUploadedImage, setProcessedImage, setError, setGrid } = useAppStore.getState()
    
    setUploadedImage('image-123')
    setProcessedImage('processed-123')
    setError('error')
    setGrid([[1, 0]])
    
    setUploadedImage(null)
    setProcessedImage(null)
    setError(null)
    setGrid(null)
    
    expect(useAppStore.getState().uploadedImage).toBeNull()
    expect(useAppStore.getState().processedImage).toBeNull()
    expect(useAppStore.getState().error).toBeNull()
    expect(useAppStore.getState().grid).toBeNull()
  })
})
