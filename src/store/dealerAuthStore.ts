import { create } from 'zustand'

interface DealerUser {
  id:    string
  name:  string
  email: string
  phone: string
}

interface DealerAuthStore {
  dealer:    DealerUser | null
  hydrated:  boolean
  setAuth:   (dealer: DealerUser) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}

export const useDealerAuthStore = create<DealerAuthStore>((set, get) => ({
  dealer:   null,
  hydrated: false,

  setAuth(dealer) {
    set({ dealer, hydrated: true })
  },

  clearAuth() {
    set({ dealer: null, hydrated: true })
  },

  isAuthenticated: () => get().dealer !== null,
}))
