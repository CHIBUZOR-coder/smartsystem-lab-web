import { create } from 'zustand'

export type ToastType = 'success' | 'error'

export interface Toast {
  id:      number
  type:    ToastType
  message: string
}

interface ToastStore {
  toasts:  Toast[]
  push:    (type: ToastType, message: string) => void
  dismiss: (id: number) => void
}

let nextId = 0
export const TOAST_DURATION_MS = 4500

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  push(type, message) {
    const id = ++nextId
    set(s => ({ toasts: [...s.toasts, { id, type, message }] }))
    setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), TOAST_DURATION_MS)
  },

  dismiss(id) {
    set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }))
  },
}))

// Extracts a human-readable message from an axios error shaped like
// { error: string } or { error: string, issues: ZodIssue[] } — the shape
// every controller in the API uses (see errorHandler.js).
export function extractErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  const data = (err as { response?: { data?: { error?: string; issues?: { message: string }[] } } })?.response?.data
  return data?.issues?.[0]?.message || data?.error || fallback
}

export const toast = {
  success: (message: string) => useToastStore.getState().push('success', message),
  error:   (message: string) => useToastStore.getState().push('error', message),
}
