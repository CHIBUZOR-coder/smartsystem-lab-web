import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeStore {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggle: () => void
  resolvedTheme: () => 'light' | 'dark'
}

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(resolved: 'light' | 'dark') {
  const root = document.documentElement
  if (resolved === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: 'system',

      resolvedTheme() {
        const { mode } = get()
        return mode === 'system' ? getSystemTheme() : mode
      },

      setMode(mode) {
        set({ mode })
        const resolved = mode === 'system' ? getSystemTheme() : mode
        applyTheme(resolved)
      },

      toggle() {
        const resolved = get().resolvedTheme()
        const next = resolved === 'light' ? 'dark' : 'light'
        set({ mode: next })
        applyTheme(next)
      },
    }),
    {
      name: 'allinzucol-theme',
      partialize: (state) => ({ mode: state.mode }),
    }
  )
)

// Called once at app startup — applies stored/OS theme before first render
export function initTheme() {
  const stored = localStorage.getItem('allinzucol-theme')
  let mode: ThemeMode = 'system'
  if (stored) {
    try {
      mode = (JSON.parse(stored) as { state: { mode: ThemeMode } }).state.mode
    } catch {
      mode = 'system'
    }
  }
  const resolved = mode === 'system' ? getSystemTheme() : mode
  applyTheme(resolved)
}
