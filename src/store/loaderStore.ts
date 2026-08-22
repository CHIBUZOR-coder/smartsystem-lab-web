import { create } from 'zustand'

interface LoaderState {
  active: number
  show: () => void
  hide: () => void
}

export const useLoaderStore = create<LoaderState>(set => ({
  active: 0,
  show: () => set(s => ({ active: s.active + 1 })),
  hide: () => set(s => ({ active: Math.max(0, s.active - 1) })),
}))
