import { useEffect } from 'react'
import { useRouteError } from 'react-router-dom'
import ErrorFallback from './ui/ErrorFallback'

const RouteErrorBoundary = () => {
  const error = useRouteError()

  useEffect(() => {
    console.error('Route error:', error)
  }, [error])

  return <ErrorFallback />
}

export default RouteErrorBoundary
