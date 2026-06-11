import { create } from 'zustand'

interface AppState {
  uploadedImage: string | null
  setUploadedImage: (image: string | null) => void
  processedImage: string | null
  setProcessedImage: (image: string | null) => void
  currentFilter: string | null
  setCurrentFilter: (filter: string | null) => void
  grid: number[][] | null
  setGrid: (grid: number[][] | null) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  uploadedImage: null,
  setUploadedImage: (image) => set({ uploadedImage: image }),
  processedImage: null,
  setProcessedImage: (image) => set({ processedImage: image }),
  currentFilter: null,
  setCurrentFilter: (filter) => set({ currentFilter: filter }),
  grid: null,
  setGrid: (grid) => set({ grid }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  error: null,
  setError: (error) => set({ error }),
}))
