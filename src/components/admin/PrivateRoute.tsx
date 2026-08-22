import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { type ReactNode } from 'react'

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default PrivateRoute
