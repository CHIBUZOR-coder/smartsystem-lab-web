import axios from 'axios'
import { useLoaderStore } from '../store/loaderStore'
import { ADMIN_BASE } from './adminPath'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // send httpOnly auth cookie on every request
})

const isMutation = (method?: string) =>
  ['post', 'put', 'patch', 'delete'].includes((method ?? '').toLowerCase())

// Show global loader for mutations
api.interceptors.request.use(config => {
  if (isMutation(config.method)) useLoaderStore.getState().show()
  return config
})

// Hide global loader on response (success or error)
api.interceptors.response.use(
  res => {
    if (isMutation(res.config.method)) useLoaderStore.getState().hide()
    return res
  },
  err => {
    if (isMutation(err.config?.method)) useLoaderStore.getState().hide()
    if (err.response?.status === 401) {
      if (window.location.pathname.startsWith(ADMIN_BASE) &&
          window.location.pathname !== `${ADMIN_BASE}/login`) {
        window.location.href = `${ADMIN_BASE}/login`
      }
    }
    return Promise.reject(err)
  }
)

export default api
