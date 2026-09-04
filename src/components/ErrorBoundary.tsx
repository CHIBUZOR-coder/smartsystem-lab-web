import { Component, type ErrorInfo, type ReactNode } from 'react'
import ErrorFallback from './ui/ErrorFallback'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) return <ErrorFallback />
    return this.props.children
  }
}

export default ErrorBoundary
