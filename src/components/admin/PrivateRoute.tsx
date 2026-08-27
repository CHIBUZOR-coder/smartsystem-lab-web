import { useEffect, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import api from '../../lib/api'

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { admin, hydrated, setAuth, clearAuth } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    if (!hydrated) {
      api.get('/api/auth/me')
        .then(res => setAuth(res.data.admin))
        .catch(() => clearAuth())
    }
  }, [hydrated, setAuth, clearAuth])

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default PrivateRoute
