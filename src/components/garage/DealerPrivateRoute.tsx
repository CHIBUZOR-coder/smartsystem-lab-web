import { useEffect, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useDealerAuthStore } from '../../store/dealerAuthStore'
import api from '../../lib/api'

const DealerPrivateRoute = ({ children }: { children: ReactNode }) => {
  const { dealer, hydrated, setAuth, clearAuth } = useDealerAuthStore()
  const location = useLocation()

  useEffect(() => {
    if (!hydrated) {
      api.get('/api/dealer-auth/me')
        .then(res => setAuth(res.data.dealer))
        .catch(() => clearAuth())
    }
  }, [hydrated, setAuth, clearAuth])

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#061414]">
        <div className="w-6 h-6 border-2 border-[#00C896] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!dealer) {
    return <Navigate to="/garage/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default DealerPrivateRoute
