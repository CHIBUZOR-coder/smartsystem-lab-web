import { create } from 'zustand'

interface AdminUser {
  id:    string
  name:  string
  email: string
  role:  'SUPER_ADMIN' | 'EDITOR'
}

interface AuthStore {
  admin:     AdminUser | null
  hydrated:  boolean
  setAuth:   (admin: AdminUser) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  admin:    null,
  hydrated: false,

  setAuth(admin) {
    set({ admin, hydrated: true })
  },

  clearAuth() {
    set({ admin: null, hydrated: true })
  },

  isAuthenticated: () => get().admin !== null,
}))
