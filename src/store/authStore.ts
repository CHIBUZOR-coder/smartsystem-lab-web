import { create } from 'zustand'

interface AdminUser {
  id:    string
  name:  string
  email: string
  role:  'SUPER_ADMIN' | 'EDITOR'
}

interface AuthStore {
  token: string | null
  admin: AdminUser | null
  setAuth:   (token: string, admin: AdminUser) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}

const TOKEN_KEY = 'az_admin_token'

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: localStorage.getItem(TOKEN_KEY),
  admin: null,

  setAuth(token, admin) {
    localStorage.setItem(TOKEN_KEY, token)
    set({ token, admin })
  },

  clearAuth() {
    localStorage.removeItem(TOKEN_KEY)
    set({ token: null, admin: null })
  },

  isAuthenticated: () => !!get().token,
}))
